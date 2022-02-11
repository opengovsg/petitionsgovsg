import { StatusCodes } from 'http-status-codes'
import { ControllerHandler } from '../../types/response-handler'
import { decodeUserJWT } from '../../util/jwt'
export class AuthMiddleware {
  /**
   * Middleware that only allows authenticated users to pass through to the next
   * handler.
   * @returns next if user exists in session
   * @returns 401 if user does not exist in session
   */
  authenticate: ControllerHandler = (req, res, next) => {
    // Check if user is authenticated
    try {
      const token = req.cookies.jwt
      req.user = decodeUserJWT(req)
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'User not signed in.' })
    }
    return next()
  }
}
