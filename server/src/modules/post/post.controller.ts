import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { Post } from '~shared/types/base'
import { createLogger } from '../../bootstrap/logging'
import { Message } from '../../types/message-type'
import { UpdatePostRequestDto } from '../../types/post-type'
import { ControllerHandler } from '../../types/response-handler'
import { SortType } from '../../types/sort-type'
import { createValidationErrMessage } from '../../util/validation-error'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
import { PostService, PostWithUser } from './post.service'

const logger = createLogger(module)

export class PostController {
  private authService: Public<AuthService>
  private postService: Public<PostService>
  private userService: Public<UserService>

  constructor({
    authService,
    postService,
    userService,
  }: {
    authService: Public<AuthService>
    postService: Public<PostService>
    userService: Public<UserService>
  }) {
    this.authService = authService
    this.postService = postService
    this.userService = userService
  }

  /**
   * Lists all post
   * @query sort Sort by popularity or recent
   * @query size Number of posts to return
   * @query page If size is given, specify which page to return
   * @return 200 with posts and totalItem for pagination
   * @return 500 when database error occurs
   */
  listPosts: ControllerHandler<
    undefined,
    { posts: Post[]; totalItems: number } | Message,
    undefined,
    {
      page?: number
      size?: number
      sort?: SortType
    }
  > = async (req, res) => {
    const { page, size, sort = SortType.Top } = req.query
    try {
      const data = await this.postService.listPosts({
        sort: sort as SortType,
        page: page,
        size: size,
      })
      return res.status(StatusCodes.OK).json(data)
    } catch (error) {
      if (error instanceof Error) {
        logger.error({
          message: 'Error while listing posts',
          meta: {
            function: 'listPosts',
          },
          error,
        })
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Server Error' })
      }
    }
  }

  /**
   * Get a single post and all the tags, topic and users associated with it
   * @param postId Id of the post
   * @query relatedPosts if true, return related posts
   * @return 200 with post
   * @return 403 if user does not have permission to access post
   * @return 500 for database error
   */
  getSinglePost: ControllerHandler<
    { id: number },
    PostWithUser | Message,
    undefined,
    { relatedPosts?: number }
  > = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json(errors.array()[0].msg)
    }
    let post
    try {
      post = await this.postService.getSinglePost(req.params.id)
    } catch (error) {
      logger.error({
        message: 'Error while retrieving single post',
        meta: {
          function: 'getSinglePost',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }

    try {
      await this.authService.verifyUserCanViewPost(
        post,
        req.user?.id.toString() ?? '',
      )
    } catch (error) {
      logger.error({
        message: 'Error while retrieving single post',
        meta: {
          function: 'getSinglePost',
        },
        error,
      })
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'User does not have permission to access this post' })
    }

    return res.status(StatusCodes.OK).json(post)
  }

  /**
   * Create a new post
   * @body title title of post
   * @body tagname tags of post
   * @body description description of post
   * @body topicId topic id of post
   * @return 200 if post is created
   * @return 400 if title and description is too short or long
   * @return 401 if user is not signed in
   * @return 500 if database error
   */
  createPost: ControllerHandler<
    undefined,
    { data: number } | Message,
    {
      title: string
      summary: string
      reason: string | null
      request: string | null
      references: string | null
    },
    undefined
  > = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json(errors.array()[0].msg)
    }
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'User not signed in' })
    }

    try {
      if (!req.user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'User not signed in' })
      }

      const data = await this.postService.createPost({
        title: req.body.title,
        summary: req.body.summary,
        reason: req.body.reason,
        request: req.body.request,
        userId: req.user?.id,
        references: req.body.references,
      })

      return res.status(StatusCodes.OK).json({ data: data })
    } catch (error) {
      logger.error({
        message: 'Error while creating post',
        meta: {
          function: 'addPost',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server error' })
    }
  }

  /**
   * Delete a post
   * @param id Post to be deleted
   * @return 200 if successful
   * @return 401 if user is not logged in
   * @return 403 if user does not have permission to delete post
   * @return 500 if database error
   */
  deletePost: ControllerHandler<{ id: string }, Message> = async (req, res) => {
    const postId = Number(req.params.id)
    try {
      const userId = req.user?.id
      if (!userId) {
        logger.error({
          message: 'UserId is undefined after authenticated',
          meta: {
            function: 'deletePost',
          },
        })
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'You must be logged in to delete posts.' })
      }
      const hasPermission = await this.authService.hasPermissionToAnswer(
        userId,
        postId,
      )
      if (!hasPermission) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'You do not have permission to delete this post.' })
      }
      await this.postService.deletePost(postId)
      return res.status(StatusCodes.OK).send({ message: 'OK' })
    } catch (error) {
      logger.error({
        message: 'Error while deleting post',
        meta: {
          function: 'deletePost',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server error' })
    }
  }
}
