import { AuthMiddleware } from '../auth/auth.middleware'
import express from 'express'
import { body } from 'express-validator'
import { SignatureController } from './signature.controller'

export const routeSignatures = ({
  controller,
  authMiddleware,
}: {
  controller: SignatureController
  authMiddleware: AuthMiddleware
}): express.Router => {
  const router = express.Router()
  const { authenticate } = authMiddleware

  /**
   * Lists all signatures to a post
   * @route   GET /api/posts/signatures/:id
   * @returns 200 with array of signatures
   * @returns 500 if database error occurs
   * @access  Public
   */
  router.get('/:id([0-9]+$)', controller.listSignatures)

  /**
   * Create an signature attached to a post
   * @route   POST /api/posts/signatures/:id
   * @returns 200 with new signature id
   * @returns 400 if invalid request
   * @returns 401 if user not signed in
   * @returns 500 if database error
   * @access  Private
   */
  router.post(
    '/:id([0-9]+$)',
    [
      authenticate,
      body('useName', 'useName is a required boolean').isBoolean(),
    ],
    controller.createSignature,
  )

  /**
   * Create an signature attached to a post
   * @route   POST /api/posts/signatures/:id
   * @returns 200 with signature body if user has signed
   * @returns 200 with null body if user has not signed
   * @returns 500 if database error
   * @access  Private
   */
  router.get('/check/:id([0-9]+$)', authenticate, controller.checkUserHasSigned)
  return router
}
