import express from 'express'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { UserAuthType } from '~shared/types/api'
import { ControllerHandler } from '../../../types/response-handler'
import { PostController } from '../post.controller'

describe('PostController', () => {
  const path = '/posts'
  const authService = {
    hasPermissionToEditPost: jest.fn(),
    verifyUserCanViewPost: jest.fn(),
  }
  const postService = {
    createPost: jest.fn(),
    deletePost: jest.fn(),
    getSinglePost: jest.fn(),
    listPosts: jest.fn(),
  }
  const userService = {
    loadUser: jest.fn(),
    loadUserBySgid: jest.fn(),
  }
  const controller = new PostController({
    authService,
    postService,
    userService,
  })

  // Set up auth middleware to inject user
  let user: Express.User | undefined = { id: 1, type: UserAuthType.Public }
  const middleware: ControllerHandler = (req, res, next) => {
    req.user = user
    next()
  }

  beforeEach(() => {
    user = { id: 1, type: UserAuthType.Public }
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })

  describe('listPosts', () => {
    beforeEach(() => {
      postService.listPosts.mockReset()
    })
    it('should return 200 on successful data retrieval', async () => {
      // Arrange
      const data = { rows: ['1', '2'], totalItems: 5 }
      postService.listPosts.mockReturnValue(data)

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.get(path, controller.listPosts)
      const request = supertest(app)

      // Act
      const response = await request.get(path)

      // Assert
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(data)
    })

    it('should return 500 on any other errors', async () => {
      // Arrange
      const error = new Error('Database error')
      postService.listPosts.mockImplementation(() => {
        throw error
      })

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.get(path, controller.listPosts)
      const request = supertest(app)

      // Act
      const response = await request.get(path)

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
    })
  })

  describe('createPost', () => {
    const userId = 21
    const postId = 13

    beforeEach(() => {
      userService.loadUser.mockResolvedValue({ userId })
      postService.createPost.mockResolvedValue(postId)
    })
    it('returns 401 on no user', async () => {
      user = undefined

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.post(path, controller.createPost)
      const request = supertest(app)

      const response = await request.post(path)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({
        message: 'User not signed in',
      })
      expect(postService.createPost).not.toHaveBeenCalled()
    })
    it('returns 500 on userService problem', async () => {
      userService.loadUser.mockRejectedValue(new Error('bad user'))

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.post(path, controller.createPost)
      const request = supertest(app)

      const response = await request.post(path)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Server error',
      })
      expect(postService.createPost).not.toHaveBeenCalled()
    })
    it('returns 500 on postService problem', async () => {
      const body = { title: 'Title', summary: 'Summary' }

      postService.createPost.mockRejectedValue(new Error('bad post'))

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.post(path, controller.createPost)
      const request = supertest(app)

      const response = await request.post(path).send(body)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Server error',
      })
      expect(postService.createPost).toHaveBeenCalledWith({
        ...body,
        userId: user?.id,
      })
    })
    it('returns 200 on successful creation', async () => {
      const body = { title: 'Title', summary: 'Summary' }

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.post(path, controller.createPost)
      const request = supertest(app)

      const response = await request.post(path).send(body)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual({ data: postId })
      expect(postService.createPost).toHaveBeenCalledWith({
        ...body,
        userId: user?.id,
      })
    })
  })

  describe('deletePost', () => {
    const postId = 1

    beforeEach(() => {
      authService.hasPermissionToEditPost.mockReset()
      postService.deletePost.mockReset()
    })

    it('returns 200 on successful deletion', async () => {
      authService.hasPermissionToEditPost.mockResolvedValue(true)
      postService.deletePost.mockImplementation(() => Promise.resolve())

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.delete(path + '/:id([0-9]+$)', controller.deletePost)
      const request = supertest(app)

      const response = await request.delete(path + `/${postId}`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual({
        message: 'OK',
      })
      expect(postService.deletePost).toHaveBeenCalledWith(postId)
    })

    it('returns 401 on no user', async () => {
      user = undefined

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.delete(path + '/:id([0-9]+$)', controller.deletePost)
      const request = supertest(app)

      const response = await request.delete(path + `/${postId}`)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({
        message: 'You must be logged in to delete posts.',
      })
      expect(postService.deletePost).not.toHaveBeenCalled()
    })

    it('returns 403 if user does not have permission to delete post', async () => {
      authService.hasPermissionToEditPost.mockResolvedValue(false)

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.delete(path + '/:id([0-9]+$)', controller.deletePost)
      const request = supertest(app)

      const response = await request.delete(path + `/${postId}`)

      expect(response.status).toEqual(StatusCodes.FORBIDDEN)
      expect(response.body).toStrictEqual({
        message: 'You do not have permission to delete this post.',
      })
      expect(postService.deletePost).not.toHaveBeenCalled()
    })

    it('returns 500 on database error', async () => {
      authService.hasPermissionToEditPost.mockRejectedValue(
        new Error('Error while deleting post'),
      )

      const app = express()
      app.use(express.json())
      app.use(middleware)
      app.delete(path + '/:id([0-9]+$)', controller.deletePost)
      const request = supertest(app)

      const response = await request.delete(path + `/${postId}`)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Server error',
      })
      expect(postService.deletePost).not.toHaveBeenCalled()
    })
  })
})
