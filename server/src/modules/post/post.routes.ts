import { AuthMiddleware } from '../auth/auth.middleware'
import express from 'express'
import { check, param } from 'express-validator'
import { PostController } from './post.controller'
import { limiter } from '@/middleware/limiter'

export const routePosts = ({
  controller,
  authMiddleware,
}: {
  controller: PostController
  authMiddleware: Public<AuthMiddleware>
}): express.Router => {
  const router = express.Router()

  /**
   * Lists all post
   * @route   GET /api/posts
   * @returns 200 with posts
   * @returns 500 when database error occurs
   * @access  Public
   */
  router.get('/', controller.listPosts)

  /**
   * Get a single post and all users associated with it
   * @route  GET /api/posts/:id
   * @return 200 with post
   * @return 403 if user does not have permission to access post
   * @return 500 for database error
   * @access Public
   */
  router.get(
    '/:id',
    [limiter, param('id').isString()],
    controller.getSinglePost,
  )

  /**
   * Create a new post
   * @route  POST /api/posts/
   * @return 200 if post is created
   * @return 400 if title and description is too short or long
   * @return 401 if user is not signed in
   * @return 500 if database error
   * @access Private
   */
  router.post(
    '/',
    [
      authMiddleware.authenticate,
      limiter,
      check(
        'title',
        'Enter a title with minimum of 15 characters and maximum 150 characters',
      ).isLength({
        min: 15,
        max: 150,
      }),
      check('email', 'Enter an email with a minimum of 1 characters').isLength({
        min: 1,
      }),
      check('reason', 'Enter a reason with minimum 1 character').isLength({
        min: 1,
      }),
      check('request', 'Enter a request with minimum 1 character').isLength({
        min: 1,
      }),
    ],
    controller.createPost,
  )

  /**
   * Update a post
   * @route PUT /api/posts/update/:id
   * @return 200 if successful
   * @return 401 if user is not logged in
   * @return 403 if user does not have permission to delete post
   * @return 500 if database error
   */
  router.put(
    '/:id',
    [
      authMiddleware.authenticate,
      limiter,
      check(
        'title',
        'Enter a title with minimum of 15 characters and maximum 150 characters',
      ).isLength({
        min: 15,
        max: 150,
      }),
      check('email', 'Enter an email with a minimum of 1 characters').isLength({
        min: 1,
      }),
      check('reason', 'Enter a reason with minimum 1 character').isLength({
        min: 1,
      }),
      check('request', 'Enter a request with minimum 1 character').isLength({
        min: 1,
      }),
    ],
    controller.updatePost,
  )

  return router
}
