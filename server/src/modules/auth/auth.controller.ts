import SgidClient from '@opengovsg/sgid-client'
import { StatusCodes } from 'http-status-codes'
import {
  ErrorDto,
  LoadPublicUserDto,
  LoadUserNameDto,
  UserAuthType,
} from '~shared/types/api'
import { formCallbackRedirectURL } from '@/bootstrap/config/auth'
import { createLogger } from '@/bootstrap/logging'
import { ControllerHandler } from '@/types/response-handler'
import { hashData } from '@/util/hash'
import { decodeUserJWT, encodeUserJWT } from '@/util/jwt'
import { AuthService } from '../auth/auth.service'
import { PostService } from '../post/post.service'

const logger = createLogger(module)
export class AuthController {
  private authService: Public<AuthService>
  private postService: Public<PostService>
  private sgidClient: SgidClient

  constructor({
    authService,
    postService,
    sgidClient,
  }: {
    authService: Public<AuthService>
    postService: Public<PostService>
    sgidClient: SgidClient
  }) {
    this.authService = authService
    this.postService = postService
    this.sgidClient = sgidClient
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
    try {
      const { id, fullname } = decodeUserJWT(req)
      return res.status(StatusCodes.OK).json({ id, fullname })
    } catch (error) {
      logger.error({
        message: 'Error while loading user',
        meta: {
          function: 'loadUser',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
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
    never,
    undefined,
    undefined,
    { redirect: string; useName: string; nonce: string | undefined }
  > = async (req, res) => {
    const { redirect, useName, nonce } = req.query

    const scopes = useName === 'true' ? 'openid myinfo.name' : 'openid'

    // store redirect to post in state
    const { url: authUrl } = this.sgidClient.authorizationUrl(
      redirect,
      scopes,
      nonce,
    )
    res.clearCookie('jwt')
    return res.redirect(authUrl)
  }

  /**
   * Handle callback from sgid
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
    const { sub, accessToken } = await this.sgidClient.callback(code, undefined)
    const { data } = await this.sgidClient.userinfo(accessToken)
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
    const redirectUrl = formCallbackRedirectURL(state)
    return res.redirect(redirectUrl)
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
    try {
      const { id, fullname } = decodeUserJWT(req)
      if (!fullname) {
        logger.error({
          message: "Error loading user's name",
          meta: {
            function: 'loadUserName',
            userId: id,
          },
        })
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
      }
      return res.status(StatusCodes.OK).json({ fullname: fullname })
    } catch (error) {
      logger.error({
        message: "Error while loading user's name",
        meta: {
          function: 'loadUser',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }
  }

  /**
   * Check if logged in user is petition owner
   * @returns 200 with boolean on successful check
   * @returns 500 if database error
   */
  verifyPetitionOwner: ControllerHandler<
    { id: string },
    boolean | ErrorDto | null
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
