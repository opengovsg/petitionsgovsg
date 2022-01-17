import { StatusCodes } from 'http-status-codes'
import { isEmpty } from 'lodash'
import passport from 'passport'
import {
  callbackRedirectUnauthorisedURL,
  callbackRedirectURL,
} from '../../bootstrap/config/auth'
import { Message } from 'src/types/message-type'
import { ErrorDto, LoadPublicUserDto, UserAuthType } from '~shared/types/api'
import { createLogger } from '../../bootstrap/logging'
import { UserService } from '../../modules/user/user.service'
import { ControllerHandler } from '../../types/response-handler'

const logger = createLogger(module)

export class AuthController {
  private userService: Public<UserService>

  constructor({ userService }: { userService: Public<UserService> }) {
    this.userService = userService
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
        const user = await this.userService.loadUser(id)
        return res.status(StatusCodes.OK).json(user)
      } catch (error) {
        logger.error({
          message: 'Database Error while loading public user',
          meta: {
            function: 'loadPublicUser',
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

  /**
   * Verify otp received by the user
   * @params code
   * @params state
   * @returns 302 to home page if successful login
   * @returns 302 to unauthorised page if error
   * @returns 302 to sgid auth page if no state or code params received
   */
  handleSgidLogin: ControllerHandler<
    undefined,
    undefined,
    undefined,
    { code: string; state: string | undefined }
  > = async (req, res, next) => {
    passport.authenticate('sgid', {}, (error, user, info: Message) => {
      if (error) {
        logger.error({
          message: 'Error while authenticating',
          meta: {
            function: 'handleSgidLogin',
          },
          error,
        })
        return res.redirect(callbackRedirectUnauthorisedURL)
      }
      if (!user) {
        logger.warn({
          message: info.message,
          meta: {
            function: 'handleSgidLogin',
          },
        })
        res.redirect(callbackRedirectUnauthorisedURL)
      }
      req.logIn(user, (error) => {
        if (error) {
          logger.error({
            message: 'Error while logging in',
            meta: {
              function: 'handleSgidLogin',
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
                function: 'handleSgidLogin',
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
                  function: 'handleSgidLogin',
                },
                error,
              })
              return res.redirect(callbackRedirectUnauthorisedURL)
            }
            return res.redirect(callbackRedirectURL)
          })
        })
      })
    })(req, res, next)
  }
}
