import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { POST_ID } from '@/util/db/constants'
import { ControllerHandler } from '@/types/response-handler'
import {
  mockAnonUser,
  mockAnonUserJWT,
  mockOtherUser,
  mockOtherUserJWT,
  mockUser,
  mockUserJWT,
} from '@/util/db/data/user'
import { AuthController } from '../auth.controller'
import { mockPost } from '@/util/db/data/post'
import SgidClient from '@opengovsg/sgid-client'

describe('AuthController', () => {
  let db: SequelizeWithModels

  // Set up auth middlnpngdsgagageware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const middleware: ControllerHandler = (req, _res, next) => {
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

  const authService = {
    verifyUserCanViewPost: jest.fn(),
    verifyPetitionOwner: jest.fn(),
  }

  const sgidClient = new SgidClient({
    endpoint: 'http://localhost:5156/sgid/v1/oauth',
    clientId: 'petitionsgov',
    clientSecret: 'petitionsecret',
    redirectUri: 'http://localhost:3000',
    privateKey: 'privatekey',
  })

  const callbackSpy = jest.spyOn(sgidClient, 'callback')
  const userinfoSpy = jest.spyOn(sgidClient, 'userinfo')

  const authController = new AuthController({
    authService,
    postService,
    sgidClient,
  })

  // Paths
  const fullnamePath = '/fullname'
  const loginPath = '/sgid/login'
  const callbackPath = '/callback'
  const checkOwnerPath = `/checkpetitionowner/${POST_ID}`

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)

    jest.resetAllMocks()
  })

  describe('loadUser', () => {
    const app = express()
    app.use(middleware)
    app.get('/', authController.loadUser)
    const request = supertest(app)
    it('should return 200 when jwt is valid', async () => {
      authUser = mockUser
      jwt = mockUserJWT

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })

    it('should return 500 when jwt is invalid', async () => {
      authUser = mockUser
      jwt = { jwt: 'malformedjwt' }

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('loadUserName', () => {
    const app = express()
    app.use(middleware)
    app.get(fullnamePath, authController.loadUserName)
    const request = supertest(app)

    it('should return 200 with user fullname', async () => {
      authUser = mockUser
      jwt = mockUserJWT

      const response = await request.get(fullnamePath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toEqual({ fullname: mockUser.fullname })
      expect(response.body).toMatchSnapshot()
    })

    it('should return 500 when fullname is not found', async () => {
      authUser = mockAnonUser
      jwt = mockAnonUserJWT

      const response = await request.get(fullnamePath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toEqual(null)
      expect(response.body).toMatchSnapshot()
    })

    it('should return 500 on bad service', async () => {
      authUser = mockUser
      jwt = { jwt: 'malformedjwt' }

      const response = await request.get(fullnamePath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('verifyPetitionOwner', () => {
    const app = express()
    app.use(middleware)
    app.get('/checkpetitionowner/:id', authController.verifyPetitionOwner)
    const request = supertest(app)

    it('should return 200 true when user is post owner', async () => {
      authUser = mockUser
      jwt = mockUserJWT
      postService.getSinglePost.mockResolvedValueOnce(mockPost)
      authService.verifyPetitionOwner.mockReturnValueOnce(true)

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toEqual(true)
      expect(response.body).toMatchSnapshot()
    })

    it('should return 200 false when user is not post owner', async () => {
      authUser = mockOtherUser
      jwt = mockOtherUserJWT
      postService.getSinglePost.mockResolvedValueOnce(mockPost)
      authService.verifyPetitionOwner.mockReturnValueOnce(false)

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toEqual(false)
      expect(response.body).toMatchSnapshot()
    })

    it('should return 500 on bad service', async () => {
      authUser = mockUser
      jwt = { jwt: 'malformedjwt' }

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('handleSgidLogin', () => {
    const app = express()
    app.get(loginPath, authController.handleSgidLogin)
    const request = supertest(app)

    it('should return 200 on valid login', async () => {
      const redirect = '/create'
      const useName = 'true'
      // specify nonce only for testing repeatability
      // otherwise leave as undefined to use nonce generator in sgid client
      const nonce = 'abc'

      const response = await request.get(
        `${loginPath}?redirect=${redirect}&useName=${useName}&nonce=${nonce}`,
      )

      expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY)
      expect(response.header.location).toMatchSnapshot()
    })
  })

  describe('handleSgidCallback', () => {
    const app = express()
    app.get(callbackPath, authController.handleSgidCallback)
    const request = supertest(app)

    it('should return 200 on valid callback', async () => {
      const state = '/to_redirect'
      const code = 'code'
      callbackSpy.mockResolvedValue({ sub: mockUser.id, accessToken: 'access' })
      userinfoSpy.mockResolvedValue({
        sub: mockUser.id,
        data: { 'myinfo.name': mockUser.fullname },
      })
      const response = await request.get(
        `${callbackPath}?state=${state}&code=${code}`,
      )

      expect(response.header['set-cookie']).toBeDefined()
      expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY)
    })
  })
})
