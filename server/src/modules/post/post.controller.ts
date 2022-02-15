import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import {
  CreatePostReqDto,
  CreatePostResDto,
  ErrorDto,
  ListPostsDto,
  Message,
  PostWithAddresseeAndSignatures,
  UpdatePostReqDto,
  UpdatePostResDto,
} from '~shared/types/api'
import { createLogger } from '../../bootstrap/logging'
import { ControllerHandler } from '../../types/response-handler'
import { SortType } from '../../types/sort-type'
import { generateSalt, hashData } from '../../util/hash'
import { AuthService } from '../auth/auth.service'
import { MIN_ENDORSER_COUNT } from '../signatures/signature.controller'
import { PostService } from './post.service'

const logger = createLogger(module)

export class PostController {
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
   * Lists all post
   * @query sort Sort by popularity or recent
   * @query size Number of posts to return
   * @query page If size is given, specify which page to return
   * @return 200 with posts and totalItem for pagination
   * @return 500 when database error occurs
   */
  listPosts: ControllerHandler<
    undefined,
    ListPostsDto | ErrorDto,
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

  /**
   * Get a single post and all the signatures associated with it
   * @param postId Id of the post
   * @query relatedPosts if true, return related posts
   * @return 200 with post
   * @return 403 if user does not have permission to access post
   * @return 500 for database error
   */
  getSinglePost: ControllerHandler<
    { id: string },
    PostWithAddresseeAndSignatures | ErrorDto,
    undefined,
    { relatedPosts?: number }
  > = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json(errors.array()[0].msg)
    }
    let post
    try {
      post = await this.postService.getSinglePost(Number(req.params.id))
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
      this.authService.verifyUserCanViewPost(post, req.user?.id)
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
   * @body summary summary of post
   * @body reason reason of post
   * @body request request of post
   * @body references references of post
   * @return 200 if post is created
   * @return 400 if title and description is too short or long
   * @return 401 if user is not signed in
   * @return 500 if database error
   */
  createPost: ControllerHandler<
    never,
    CreatePostResDto | ErrorDto,
    CreatePostReqDto,
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
    if (!req.user.fullname) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User not signed in' })
    }

    try {
      const salt = await generateSalt()
      const hashedUserSgid = await hashData(req.user.id, salt)

      const data = await this.postService.createPost({
        title: req.body.title,
        summary: req.body.summary,
        reason: req.body.reason,
        request: req.body.request,
        hashedUserSgid: hashedUserSgid,
        references: req.body.references,
        fullname: req.user.fullname,
        addresseeId: req.body.addresseeId,
        profile: req.body.profile,
        email: req.body.email,
        salt: salt,
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
        .json({ message: 'Server Error' })
    }
  }

  /**
   * Update a post
   * @param id id of post to update
   * @body Post Post ot be updated
   * @returns 200 if successful
   * @return 401 if user is not logged in
   * @return 403 if user does not have permission to update post
   * @return 500 if database error
   */
  updatePost: ControllerHandler<
    { id: string },
    UpdatePostResDto,
    UpdatePostReqDto,
    undefined
  > = async (req, res) => {
    const postId = Number(req.params.id)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json(errors.array()[0].msg)
      }
      if (!req.user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'You must be logged in to update posts.' })
      }
      // Check that user is owner of petition
      const post = await this.postService.getSinglePost(Number(req.params.id))
      const hashedUserSgid = await hashData(req.user.id, post.salt)
      const hasPermission = this.authService.verifyPetitionOwner(
        post,
        hashedUserSgid,
      )
      const signatureCount = post.signatures.length
      if (!hasPermission || signatureCount > 0) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'You do not have permission to update this post.' })
      }
    } catch (error) {
      logger.error({
        message: 'Error while determining permissions to update post',
        meta: {
          function: 'updatePost',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wrong, please try again.' })
    }
    // Update post in database
    try {
      const updated = await this.postService.updatePost({
        title: req.body.title,
        summary: req.body.summary ?? '',
        reason: req.body.reason,
        request: req.body.request,
        references: req.body.references ?? '',
        addresseeId: req.body.addresseeId ?? 0,
        profile: req.body.profile ?? '',
        email: req.body.email,
        id: postId,
      })

      if (!updated) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Petition failed to update' })
      }
      return res.status(StatusCodes.OK).json({ message: 'Petition updated' })
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Petition failed to update' })
    }
  }

  /**
   * Publish a post publicly (Open)
   * @param id Post to be published publicly
   * @return 200 if successful
   * @return 401 if user is not logged in
   * @return 500 if database error
   */

  publishPost: ControllerHandler<{ id: string }, Message> = async (
    req,
    res,
  ) => {
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'You must be logged in to publish posts.' })
    }
    const postId = Number(req.params.id)
    try {
      // Check that user is owner of petition
      const post = await this.postService.getSinglePost(postId)
      const hashedUserSgid = await hashData(req.user.id, post.salt)
      const hasPermission = this.authService.verifyPetitionOwner(
        post,
        hashedUserSgid,
      )
      const signatureCount = post.signatures.length
      // User cannot publish if a) he is not the owner or b) signature count is below 3
      if (!hasPermission || signatureCount <= MIN_ENDORSER_COUNT) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'You do not have permission to publish this post.' })
      }
      await this.postService.publishPost(postId)
      return res.status(StatusCodes.OK).send({ message: 'OK' })
    } catch (error) {
      logger.error({
        message: 'Error while publishing post',
        meta: {
          function: 'publishPost',
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server error' })
    }
  }
}
