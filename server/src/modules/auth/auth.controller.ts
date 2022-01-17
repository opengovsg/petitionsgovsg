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
        if (user) {
          return res.status(StatusCodes.OK).json({ id: user.id })
        } else {
          logger.error({
            message: 'User not found',
            meta: {
              function: 'loadUser',
              userId: req.user?.id,
            },
          })
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null)
        }
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
      passport.authenticate('sgid-with-name', { state: redirect })(
        req,
        res,
        next,
      )
    } else {
      passport.authenticate('sgid-with-name')(req, res, next)
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
    passport.authenticate(
      'sgid-with-name',
      {},
      (error, user, info: Message) => {
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
      },
    )(req, res, next)
  }
}
