import SgidClient from '@opengovsg/sgid-client'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { PostService } from '@/modules/post/post.service'
import { ControllerHandler } from '@/types/response-handler'
import { POST_ID } from '../../../util/db/constants'
import {
  mockOtherUserJWT,
  mockUser,
  mockUserJWT,
} from '../../../util/db/data/user'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { AuthController } from '../auth.controller'
import { AuthMiddleware } from '../auth.middleware'
import { routeAuth } from '../auth.routes'
import { AuthService } from '../auth.service'

describe('/auth', () => {
  let db: SequelizeWithModels

  // Set up auth middleware to inject user
  let jwt: { jwt: string } | undefined
  const authMiddleware = new AuthMiddleware()

  // Middleware to attach cookies
  const middleware: ControllerHandler = (req, _res, next) => {
    req['cookies'] = jwt
    next()
  }

  const app = express()
  const request = supertest(app)
  app.use(express.json())
  app.use(middleware)

  const sgidClient = new SgidClient({
    endpoint: 'http://localhost:5156/sgid/v1/oauth',
    clientId: 'petitionsgov',
    clientSecret: 'petitionsecret',
    redirectUri: 'http://localhost:3000',
    privateKey: 'privatekey',
  })

  // Mock external service(s)
  const callbackSpy = jest.spyOn(sgidClient, 'callback')
  const userinfoSpy = jest.spyOn(sgidClient, 'userinfo')

  // Paths
  const fullnamePath = '/fullname'
  const loginPath = '/sgid/login'
  const callbackPath = '/callback'
  const checkOwnerPath = `/checkpetitionowner/${POST_ID}`

  beforeAll(async () => {
    db = await createTestDatabase()

    const authService = new AuthService()
    const postService = new PostService({
      Post: db.Post,
      Signature: db.Signature,
      Addressee: db.Addressee,
      sequelize: db.sequelize,
    })

    const controller = new AuthController({
      authService,
      postService,
      sgidClient,
    })
    app.use(
      routeAuth({
        controller,
        authMiddleware,
      }),
    )
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('Get /', () => {
    it('retrieves authenticated user', async () => {
      jwt = mockUserJWT

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      jwt = undefined

      const response = await request.get('/')

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Get /fullname', () => {
    it('returns OK with fullname', async () => {
      jwt = mockUserJWT

      const response = await request.get(fullnamePath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      jwt = undefined

      const response = await request.get(fullnamePath)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Get /checkpetitionowner/:id', () => {
    it('returns OK true on user is petition owner', async () => {
      jwt = mockUserJWT

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toEqual(true)
      // Dates are stored in string format for response body
      expect(response.body).toMatchSnapshot()
    })
    it('returns OK false on user is not petition owner', async () => {
      jwt = mockOtherUserJWT

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toEqual(false)
      // Dates are stored in string format for response body
      expect(response.body).toMatchSnapshot()
    })
    it('returns UNAUTHORIZED on no user', async () => {
      jwt = undefined

      const response = await request.get(checkOwnerPath)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('Get /login', () => {
    it('redirects to sgid login', async () => {
      const response = await request.get(`${loginPath}?nonce=abc`)

      expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY)
    })
  })

  describe('Get /callback', () => {
    it('redirects to sgid login', async () => {
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
