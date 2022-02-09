import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { POST_ID } from '../../../util/db/constants'
import { ControllerHandler } from '../../../types/response-handler'
import { mockUser, mockUserJWT } from '../../../util/db/data/user'
import { errAsync } from 'neverthrow'
import { DatabaseError } from '../../core/core.errors'
import { PostController } from '../post.controller'
import { mockPost, mockPosts } from '../../../util/db/data/post'
import { UserCannotViewPostError } from '../post.errors'
import { mockSignature, mockSignatures } from '../../../util/db/data/signature'

describe('PostController', () => {
  let db: SequelizeWithModels

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const middleware: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    req['cookies'] = jwt
    next()
  }

  // Set up express-validator middleware
  const noErrors: { errors: () => { msg: string }[] }[] = []
  let errors: { errors: () => { msg: string }[] }[] = noErrors
  const invalidateIfHasErrors: ControllerHandler = (req, _res, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req['express-validator#contexts'] = errors
    next()
  }

  // Mock external service(s)
  const postService = {
    listPosts: jest.fn(),
    getSinglePost: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
    updatePost: jest.fn(),
    publishPost: jest.fn(),
  }

  const authService = {
    verifyUserCanViewPost: jest.fn(),
    verifyPetitionOwner: jest.fn(),
  }

  const postController = new PostController({
    postService,
    authService,
  })

  const postPath = `/${POST_ID}`
  const publishPath = `/publish/${POST_ID}`

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listPosts', () => {
    const app = express()
    app.get('/', postController.listPosts)
    const request = supertest(app)
    it('retrieves all post', async () => {
      postService.listPosts.mockResolvedValueOnce(mockPosts)

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockPosts)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      postService.listPosts.mockRejectedValue(errAsync(new DatabaseError()))

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('getSinglePost', () => {
    const app = express()
    app.use(invalidateIfHasErrors)
    app.get('/:id', postController.getSinglePost)
    const request = supertest(app)

    beforeEach(async () => {
      errors = noErrors
    })
    it('retrieves post with specified id', async () => {
      postService.getSinglePost.mockResolvedValueOnce(mockPost)

      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockPost)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      postService.getSinglePost.mockRejectedValue(errAsync(new DatabaseError()))

      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns FORBIDDEN on unauthorised user', async () => {
      postService.getSinglePost.mockResolvedValueOnce(mockPost)
      authService.verifyUserCanViewPost.mockImplementation(() => {
        throw new UserCannotViewPostError()
      })

      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.FORBIDDEN)
      expect(response.body).toStrictEqual({
        message: 'User does not have permission to access this post',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns BAD_REQUEST on invalidated request', async () => {
      errors = [
        {
          errors: () => [
            {
              msg: 'Validation Error',
            },
          ],
        },
      ]

      const response = await request.get(postPath)

      expect(postService.getSinglePost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('createPost', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/', postController.createPost)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      errors = noErrors
    })

    it('returns BAD_REQUEST on invalidated request', async () => {
      errors = [
        {
          errors: () => [
            {
              msg: 'Validation Error',
            },
          ],
        },
      ]

      const response = await request.post('/').send(mockPost)

      expect(postService.createPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request.post('/').send(mockPost)

      expect(postService.createPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission', async () => {
      postService.createPost.mockResolvedValueOnce(mockPost.id)
      const response = await request.post('/').send(mockPost)
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary,
        reason: mockPost.reason,
        request: mockPost.request,
        hashedUserSgid: expect.any(String),
        references: mockPost.references,
        fullname: mockPost.fullname,
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile,
        email: mockPost.email,
        salt: expect.any(String),
      }
      expect(postService.createPost).toHaveBeenCalledWith(postAttributes)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual({ data: mockPost.id })
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      postService.createPost.mockRejectedValue(errAsync(new DatabaseError()))
      const response = await request.post('/').send(mockPost)
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary,
        reason: mockPost.reason,
        request: mockPost.request,
        hashedUserSgid: expect.any(String),
        references: mockPost.references,
        fullname: mockPost.fullname,
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile,
        email: mockPost.email,
        salt: expect.any(String),
      }
      expect(postService.createPost).toHaveBeenCalledWith(postAttributes)
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('updatePost', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/:id', postController.updatePost)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      errors = noErrors
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request.post(postPath).send(mockPost)

      expect(postService.updatePost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({
        message: 'You must be logged in to update posts.',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.updatePost.mockResolvedValueOnce(true)
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary ?? '',
        reason: mockPost.reason,
        request: mockPost.request,
        references: mockPost.references ?? '',
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile ?? '',
        email: mockPost.email,
        id: POST_ID,
      }

      const response = await request.post(postPath).send(postAttributes)

      expect(postService.updatePost).toHaveBeenCalledWith(postAttributes)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual({ message: 'Petition updated' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns FORBIDDEN on posts that have already been signed', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [mockSignature],
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.updatePost.mockResolvedValueOnce(true)
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary ?? '',
        reason: mockPost.reason,
        request: mockPost.request,
        references: mockPost.references ?? '',
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile ?? '',
        email: mockPost.email,
        id: POST_ID,
      }

      const response = await request.post(postPath).send(postAttributes)

      expect(postService.updatePost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.FORBIDDEN)
      expect(response.body).toStrictEqual({
        message: 'You do not have permission to update this post.',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.updatePost.mockRejectedValue(errAsync(new DatabaseError()))
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary ?? '',
        reason: mockPost.reason,
        request: mockPost.request,
        references: mockPost.references ?? '',
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile ?? '',
        email: mockPost.email,
        id: POST_ID,
      }

      const response = await request.post(postPath).send(postAttributes)

      expect(postService.updatePost).toHaveBeenCalledWith(postAttributes)
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Petition failed to update',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on failed update', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.updatePost.mockResolvedValueOnce(false)
      const postAttributes = {
        title: mockPost.title,
        summary: mockPost.summary ?? '',
        reason: mockPost.reason,
        request: mockPost.request,
        references: mockPost.references ?? '',
        addresseeId: mockPost.addresseeId,
        profile: mockPost.profile ?? '',
        email: mockPost.email,
        id: POST_ID,
      }

      const response = await request.post(postPath).send(postAttributes)

      expect(postService.updatePost).toHaveBeenCalledWith(postAttributes)
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Petition failed to update',
      })
      expect(response.body).toMatchSnapshot()
    })
  })
  describe('publishPost', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/publish/:id', postController.publishPost)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      errors = noErrors
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request.post(publishPath)

      expect(postService.publishPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({
        message: 'You must be logged in to publish posts.',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: mockSignatures,
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.publishPost.mockResolvedValueOnce(true)

      const response = await request.post(publishPath)

      expect(postService.publishPost).toHaveBeenCalledWith(POST_ID)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual({ message: 'OK' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns FORBIDDEN on user is not post owner', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: mockSignatures,
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(false)

      const response = await request.post(publishPath)

      expect(postService.publishPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.FORBIDDEN)
      expect(response.body).toStrictEqual({
        message: 'You do not have permission to publish this post.',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns FORBIDDEN on post not meeting minimum endorser count', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)

      const response = await request.post(publishPath)

      expect(postService.publishPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.FORBIDDEN)
      expect(response.body).toStrictEqual({
        message: 'You do not have permission to publish this post.',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      const post = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: mockSignatures,
      })
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      postService.publishPost.mockRejectedValue(errAsync(new DatabaseError()))

      const response = await request.post(publishPath)

      expect(postService.publishPost).toHaveBeenCalledWith(POST_ID)
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({
        message: 'Server error',
      })
      expect(response.body).toMatchSnapshot()
    })
  })
})
