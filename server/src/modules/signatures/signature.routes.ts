import { AuthMiddleware } from '../auth/auth.middleware'
import { OwnershipCheck } from '../../middleware/checkOwnership'
import express from 'express'
import { check } from 'express-validator'
import { SignatureController } from './signature.controller'

export const routeSignatures = ({
  controller,
  authMiddleware,
  checkOwnership,
}: {
  controller: SignatureController
  authMiddleware: AuthMiddleware
  checkOwnership: OwnershipCheck
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
    [authenticate, check('text', 'Signature is required').not().isEmpty()],
    controller.createSignature,
  )

  /**
   * Delete an signature. Currently not used as a post delete
   * will archive the post and will not touch the signature.
   * @route   DELETE /api/posts/signatures/:id
   * @returns 200 on successful delete
   * @returns 500 on database error
   * @access  Private
   */
  router.delete(
    '/:id([0-9]+$)',
    [authenticate, checkOwnership],
    controller.deleteSignature,
  )
  return router
}
