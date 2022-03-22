import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { ControllerHandler } from '@/types/response-handler'
import { mockUser, mockUserJWT } from '@/util/db/data/user'
import { POST_ID } from '@/util/db/constants'
import { routePosts } from '../post.routes'
import { PostController } from '../post.controller'
import { PostService } from '../post.service'
import { mockPost } from '@/util/db/data/post'

describe('/posts', () => {
  let db: SequelizeWithModels
  const postPath = `/${POST_ID}`

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const authenticate: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    req['cookies'] = jwt
    next()
  }

  // Mock external service(s)
  const authService = {
    verifyUserCanViewPost: jest.fn(),
    verifyPetitionOwner: jest.fn(),
  }

  const app = express()
  const request = supertest(app)
  app.use(express.json())

  const postAttributes = {
    title: mockPost.title,
    summary: mockPost.summary ?? '',
    reason: mockPost.reason,
    request: mockPost.request,
    references: mockPost.references ?? '',
    addresseeId: mockPost.addresseeId,
    profile: mockPost.profile ?? '',
    email: mockPost.email,
  }

  beforeAll(async () => {
    db = await createTestDatabase()

    const postService = new PostService({
      Post: db.Post,
      Signature: db.Signature,
      Addressee: db.Addressee,
      sequelize: db.sequelize,
    })

    const controller = new PostController({
      authService,
      postService,
    })
    app.use(
      routePosts({
        controller,
        authMiddleware: { authenticate },
      }),
    )
  })

  beforeEach(async () => {
    authUser = mockUser
    jwt = mockUserJWT
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('Get /', () => {
    it('retrieves all posts', async () => {
      const response = await request.get(`/`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Get /:id', () => {
    it('retrieves posts with specified id', async () => {
      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Post /', () => {
    it('returns OK on valid submission', async () => {
      const response = await request.post(`/`).send(postAttributes)

      const { data: postId } = response.body
      const post = await db.Post.findByPk(postId)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(post).toMatchObject(postAttributes)
      expect(response.body).toMatchSnapshot({
        data: expect.any(String),
      })
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request.post(`/`).send(postAttributes)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
    it('returns BAD REQUEST on bad request', async () => {
      const badPostAttributes = {
        ...postAttributes,
        title: '< 15 char',
      }
      const response = await request.post(`/`).send(badPostAttributes)

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Put /:id', () => {
    it('returns OK on valid submission', async () => {
      authService.verifyPetitionOwner.mockReturnValueOnce(true)
      const modifiedPostAttributes = {
        ...postAttributes,
        title: 'Newly updated title',
      }
      // Make a post first
      const makePostResponse = await request.post(`/`).send(postAttributes)
      const { data: postId } = makePostResponse.body

      // Test updating of post
      const response = await request
        .put(`/${postId}`)
        .send(modifiedPostAttributes)

      const post = await db.Post.findByPk(postId)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(post).toMatchObject(modifiedPostAttributes)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined
      authService.verifyPetitionOwner.mockReturnValueOnce(false)
      const modifiedPostAttributes = {
        ...postAttributes,
        title: 'Newly updated title',
      }

      // Test updating of post
      const response = await request.put(postPath).send(modifiedPostAttributes)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })

    it('returns BAD REQUEST on bad request', async () => {
      const badPostAttributes = {
        ...postAttributes,
        title: '< 15 char',
      }
      const response = await request.put(postPath).send(badPostAttributes)

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })
  })
})
