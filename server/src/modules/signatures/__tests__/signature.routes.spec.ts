import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { Model } from 'sequelize'
import { Post } from '~shared/types/base'
import { Creation } from '@/types/sequelize'
import { routeSignatures } from '../signature.routes'
import { SignatureService } from '../signature.service'
import { SignatureController } from '../signature.controller'
import { ControllerHandler } from '@/types/response-handler'
import { mockUser, mockUserJWT } from '../../../util/db/data/user'
import { POST_ID } from '../../../util/db/constants'

describe('/signatures', () => {
  let post: Model<Post, Creation<Post>> | null
  let db: SequelizeWithModels

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const authenticate: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    req['cookies'] = jwt
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

  const app = express()
  const request = supertest(app)
  app.use(express.json())

  beforeAll(async () => {
    db = await createTestDatabase()

    const signatureService = new SignatureService({
      Post: db.Post,
      Signature: db.Signature,
      sequelize: db.sequelize,
    })
    const controller = new SignatureController({
      signatureService,
      postService,
    })
    app.use(
      routeSignatures({
        controller,
        authMiddleware: { authenticate },
      }),
    )
  })

  beforeEach(async () => {
    authUser = mockUser
    jwt = mockUserJWT
    await resetAndSetupDb(db)
    post = await db.Post.findByPk(POST_ID)
    jest.resetAllMocks()
  })

  describe('Get /:id', () => {
    it('retrieves all signatures to a post with /:id', async () => {
      const response = await request.get(`/${POST_ID}`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Post /:id', () => {
    it('returns OK on valid submission', async () => {
      // const mockPost = await db.Post.findByPk(POST_ID)
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      const response = await request
        .post(`/${POST_ID}`)
        .send({ useName: true, comment: null })

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined
      const response = await request
        .post(`/${POST_ID}`)
        .send({ useName: true, comment: null })

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
    it('returns BAD REQUEST on no useName', async () => {
      const response = await request.post(`/${POST_ID}`).send({ comment: null })

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Post /check/:id', () => {
    it('returns OK with signature on user has signed', async () => {
      // Arrange: initialise post and get user to sign the post
      postService.getSinglePost.mockResolvedValue({
        ...post?.get(),
        signatures: [],
      })
      await request.post(`/${POST_ID}`).send({ useName: true, comment: null })

      const response = await request.get(`/check/${POST_ID}`)

      expect(response.status).toEqual(StatusCodes.OK)
      // Dates are stored in string format for response body
      expect(response.body).toMatchSnapshot({
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
    it('returns OK with null body on user has not signed', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      const response = await request.get(`/check/${POST_ID}`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined
      const response = await request
        .post(`/${POST_ID}`)
        .send({ useName: true, comment: null })

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
  })
})
