import express from 'express'
import { AuthController } from './auth.controller'
import { AuthMiddleware } from './auth.middleware'

export const routeAuth = ({
  controller,
  authMiddleware,
}: {
  controller: AuthController
  authMiddleware: AuthMiddleware
}): express.Router => {
  const router = express.Router()

  /**
   * Fetch logged in user details
   * @route   GET /api/auth
   * @returns 200 with user details
   * @returns 401 if user not signed in
   * @returns 500 if database error
   * @access  Private
   */
  router.get('/', authMiddleware.authenticate, controller.loadUser)

  /**
   * Fetch logged in user name
   * @route   GET /api/auth
   * @returns 200 with user's fullname
   * @returns 401 if user not signed in
   * @returns 500 if database error
   * @access  Private
   */
  router.get('/fullname', authMiddleware.authenticate, controller.loadUserName)

  /**
   * Logout
   * @route   POST /api/auth/logout
   * @returns 200 if logged out
   * @access  private
   */
  router.post('/logout', controller.handleLogout)

  /**
   * Sgid Login
   * @route   POST /api/auth/sgid/login
   * @returns 302 with sgid oidc link
   * @access  private
   */
  router.get('/sgid/login', controller.handleSgidLogin)

  /**
   * Sgid Callback
   * @route   GET /api/auth/callback
   * @returns 302 to home page if successful login
   * @returns 302 to unauthorised page if error
   * @returns 302 to sgid auth page if no state or code params received
   * @access  private
   */
  router.get('/callback', controller.handleSgidCallback)

  /**
   * Verify petition owner check
   * @route GET /api/auth/checkpetitionowner/:id
   * @returns 200 on successful check
   * @returns 500 on database error
   */
  router.get(
    '/checkpetitionowner/:id([0-9]+$)',
    authMiddleware.authenticate,
    controller.verifyPetitionOwner,
  )

  return router
}
