import { StatusCodes } from 'http-status-codes'
import { callbackRedirectURL } from '../../bootstrap/config/auth'
import { Message } from 'src/types/message-type'
import {
  ErrorDto,
  LoadPublicUserDto,
  LoadUserNameDto,
  UserAuthType,
} from '~shared/types/api'
import { createLogger } from '../../bootstrap/logging'
import { ControllerHandler } from '../../types/response-handler'
import { AuthService } from '../auth/auth.service'
import { PostService } from '../post/post.service'
import { hashData } from '../../util/hash'
import SgidClient from '@opengovsg/sgid-client'
import { decodeUserJWT, encodeUserJWT } from '../../util/jwt'

const logger = createLogger(module)
const privateKeyPem = (process.env.SGID_PRIV_KEY ?? '').replace(/\\n/g, '\n')
const client = new SgidClient({
  endpoint: `${process.env.SGID_ENDPOINT}`,
  clientId: process.env.SGID_CLIENT_ID ?? 'petitionsgov',
  clientSecret: process.env.SGID_CLIENT_SECRET ?? '',
  redirectUri: process.env.SGID_REDIRECT_URI ?? 'http://localhost:3000',
  privateKey: privateKeyPem,
})

export class AuthController {
  private authService: Public<AuthService>
  private postService: Public<PostService>

  constructor({
    authService,
    postService,
  }: {
    authService: Public<AuthService>
    postService: Public<PostService>
  }) {
    this.authService = authService
    this.postService = postService
  }

  /**
   * Fetch logged in user details after being authenticated.
   * @returns 200 with user details
   * @returns 500 if user id not found
   * @returns 500 if database error
   */
  loadUser: ControllerHandler<unknown, LoadPublicUserDto | ErrorDto> = async (
    req,
    res,
  ) => {
    const { id, fullname } = decodeUserJWT(req)

    if (!id) {
      logger.error({
        message: 'User not found after being authenticated',
        meta: {
          function: 'loadUser',
          userId: id,
        },
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }

    try {
      return res.status(StatusCodes.OK).json({ id, fullname })
    } catch (error) {
      logger.error({
        message: 'Database Error while loading public user',
        meta: {
          function: 'loadUser',
          userId: id,
        },
        error,
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }
  }

  /**
   * Logout
   * @returns 200 if logged out
   */
  handleLogout: ControllerHandler = (req, res) => {
    if (!req.cookies.jwt) {
      logger.error({
        message: 'Attempted to sign out without a token',
        meta: {
          function: 'handleLogout',
        },
      })
      return res.sendStatus(StatusCodes.BAD_REQUEST)
    }
    res.clearCookie('jwt')
    return res.status(StatusCodes.OK).json({ message: 'Sign out successful' })
  }

  handleSgidLogin: ControllerHandler<
    undefined,
    undefined,
    undefined,
    { redirect: string }
  > = async (req, res) => {
    const { redirect } = req.query
    const scopes = 'openid myinfo.name'
    // store redirect to post in state
    const { url: authUrl } = client.authorizationUrl(redirect, scopes)
    return res.redirect(authUrl)
  }
  /**
   * Verify otp received by the user
   * @params code
   * @params state
   * @returns 302 to home page if successful login
   * @returns 302 to unauthorised page if error
   * @returns 302 to sgid auth page if no state or code params received
   */
  handleSgidCallback: ControllerHandler<
    undefined,
    undefined,
    undefined,
    { code: string; state: string | undefined }
  > = async (req, res) => {
    const { state, code } = req.query
    const { sub, accessToken } = await client.callback(code, undefined)
    const { data } = await client.userinfo(accessToken)
    const claims = {
      id: sub,
      type: UserAuthType.Public,
      fullname: data['myinfo.name'],
    }
    const token = encodeUserJWT(claims)
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    })
    return res.redirect(callbackRedirectURL(state))
  }

  /**
   * Fetch logged in user details after being authenticated.
   * @returns 200 with user details
   * @returns 500 if user id not found
   * @returns 500 if database error
   */
  loadUserName: ControllerHandler<unknown, LoadUserNameDto | ErrorDto> = async (
    req,
    res,
  ) => {
    const { id, fullname } = decodeUserJWT(req)
    if (!fullname) {
      logger.error({
        message: 'User name not found after being authenticated',
        meta: {
          function: 'loadUserName',
          userId: id,
        },
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }
    return res.status(StatusCodes.OK).json({ fullname: fullname })
  }

  /**
   * Check if logged in user is petition owner
   * @returns 200 with boolean on successful check
   * @returns 500 if database error
   */
  verifyPetitionOwner: ControllerHandler<
    { id: string },
    boolean | Message | null
  > = async (req, res) => {
    try {
      const { id } = decodeUserJWT(req)
      const post = await this.postService.getSinglePost(Number(req.params.id))
      const hashedUserSgid = await hashData(id, post.salt)
      const petitionOwnerCheck = this.authService.verifyPetitionOwner(
        post,
        hashedUserSgid,
      )
      return res.status(StatusCodes.OK).json(petitionOwnerCheck)
    } catch (error) {
      logger.error({
        message: 'Error while checking if user is petition owner',
        meta: {
          function: 'verifyPetitionOwner',
          postId: req.params.id,
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }
  }
}
