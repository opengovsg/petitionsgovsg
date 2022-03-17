import { AuthMiddleware } from '../auth/auth.middleware'
import express from 'express'
import { body } from 'express-validator'
import { SubscriptionController } from './subscription.controller'
import { limiter } from '@/middleware/limiter'

export const routeSubscriptions = ({
  controller,
  authMiddleware,
}: {
  controller: SubscriptionController
  authMiddleware: AuthMiddleware
}): express.Router => {
  const router = express.Router()
  const { authenticate } = authMiddleware

  /**
   * Create a subscription attached to a post
   * @route   POST /api/subscriptions/:id
   * @returns 200 with new subscriptions id
   * @returns 400 if invalid request
   * @returns 401 if user not signed in
   * @returns 500 if database error
   * @access  Private
   */
  router.post(
    '/:id',
    [
      authenticate,
      limiter,
      body('email', 'email should be a valid format').isString(),
    ],
    controller.createSubscription,
  )
  return router
}
