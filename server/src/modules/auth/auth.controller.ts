import { StatusCodes } from 'http-status-codes'
import { isEmpty } from 'lodash'
import passport from 'passport'
import {
  callbackRedirectUnauthorisedURL,
  callbackRedirectURL,
} from '../../bootstrap/config/auth'
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

const logger = createLogger(module)

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
    const id = req.user?.id
    const type = req.user?.type
    const fullname = req.user?.fullname ?? ''

    if (!id) {
      logger.error({
        message: 'User not found after being authenticated',
        meta: {
          function: 'loadUser',
          userId: req.user?.id,
        },
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }

    if (type === UserAuthType.Public) {
      try {
        return res.status(StatusCodes.OK).json({ id: id, fullname: fullname })
      } catch (error) {
        logger.error({
          message: 'Database Error while loading public user',
          meta: {
            function: 'loadUser',
            userId: req.user?.id,
          },
          error,
        })
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
      }
    }

    if (type === UserAuthType.Public) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }
  }

  /**
   * Logout
   * @returns 200 if logged out
   */
  handleLogout: ControllerHandler = (req, res) => {
    if (!req.session || isEmpty(req.session)) {
      logger.error({
        message: 'Attempted to sign out without a session',
        meta: {
          function: 'handleLogout',
        },
      })
      return res.sendStatus(StatusCodes.BAD_REQUEST)
    }

    req.session.destroy((error) => {
      if (error) {
        logger.error({
          message: 'Failed to destroy session',
          meta: {
            action: 'handleLogout',
            function: 'handleLogout',
          },
          error,
        })
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Sign out failed' })
      }

      // No error.
      res.clearCookie('connect.sid')
      return res.status(StatusCodes.OK).json({ message: 'Sign out successful' })
    })
  }

  handleSgidLogin: ControllerHandler<
    undefined,
    undefined,
    undefined,
    { redirect: string }
  > = async (req, res, next) => {
    const { redirect } = req.query
    // store redirect to post in state
    if (redirect) {
      passport.authenticate('sgid', { state: redirect })(req, res, next)
    } else {
      passport.authenticate('sgid')(req, res, next)
    }
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
  > = async (req, res, next) => {
    const { state } = req.query
    passport.authenticate('sgid', {}, (error, user, info: Message) => {
      if (error) {
        logger.error({
          message: 'Error while authenticating',
          meta: {
            function: 'handleSgidCallback',
          },
          error,
        })
        return res.redirect(callbackRedirectUnauthorisedURL)
      }
      if (!user) {
        logger.warn({
          message: info.message,
          meta: {
            function: 'handleSgidCallback',
          },
        })
        res.redirect(callbackRedirectUnauthorisedURL)
      }
      req.logIn(user, (error) => {
        if (error) {
          logger.error({
            message: 'Error while logging in',
            meta: {
              function: 'handleSgidCallback',
            },
            error,
          })
          return res.redirect(callbackRedirectUnauthorisedURL)
        }
        //
        /**
         * Regenerate session to mitigate session fixation
         * We regenerate the session upon logging in so an
         * anonymous session cookie cannot be used
         */
        const passportSession = req.session.passport
        req.session.regenerate(function (error) {
          if (error) {
            logger.error({
              message: 'Error while regenerating session',
              meta: {
                function: 'handleSgidCallback',
              },
              error,
            })
            return res.redirect(callbackRedirectUnauthorisedURL)
          }
          //req.session.passport is now undefined
          req.session.passport = passportSession
          req.session.save(function (error) {
            if (error) {
              logger.error({
                message: 'Error while saving regenerated session',
                meta: {
                  function: 'handleSgidCallback',
                },
                error,
              })
              return res.redirect(callbackRedirectUnauthorisedURL)
            }
            return res.redirect(callbackRedirectURL(state))
          })
        })
      })
    })(req, res, next)
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
    const fullname = req.user?.fullname

    if (!fullname) {
      logger.error({
        message: 'User name not found after being authenticated',
        meta: {
          function: 'loadUserName',
          userId: req.user?.id,
        },
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }

    try {
      return res.status(StatusCodes.OK).json({ fullname: fullname })
    } catch (error) {
      logger.error({
        message: 'Database Error while loading public user',
        meta: {
          function: 'loadUserName',
          userId: req.user?.id,
        },
        error,
      })
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
    }
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
      if (!req.user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'User not signed in' })
      }
      const post = await this.postService.getSinglePost(Number(req.params.id))
      const hashedUserSgid = await hashData(req.user.id, post.salt)
      const petitionOwnerCheck = await this.authService.verifyPetitionOwner(
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
