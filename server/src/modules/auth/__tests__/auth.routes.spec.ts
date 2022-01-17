import express from 'express'
import session from 'express-session'
import { StatusCodes } from 'http-status-codes'
import { ModelCtor, Sequelize } from 'sequelize'
import supertest, { Session } from 'supertest-session'
import { createAuthedSession, logoutSession } from '../../../../tests/mock-auth'
import { passportConfig } from '../../../bootstrap/passport'
import { User as UserModel } from '../../../models'
import { createTestDatabase, getModel, ModelName } from '../../../util/jest-db'
import { AuthController } from '../auth.controller'
import { AuthMiddleware } from '../auth.middleware'
import { routeAuth } from '../auth.routes'
import { parse } from 'querystring'
import passport from 'passport'
import passportCustom from 'passport-custom'
import { UserAuthType } from '~shared/types/api'

describe('/auth', () => {
  const path = '/auth'
  // Mock as few services as possible for testing of authentication flow
  const userService = {
    loadUser: jest.fn(),
    loadUserBySgid: jest.fn(),
  }

  let authController: AuthController

  const authMiddleware = new AuthMiddleware()

  // Set up supertest
  const app = express()
  app.use(express.json())
  let request: Session

  // Set up sequelize
  let db: Sequelize
  let User: ModelCtor<UserModel>
  let mockUser: UserModel

  beforeAll(async () => {
    db = await createTestDatabase()
    User = getModel<UserModel>(db, ModelName.User)
    mockUser = await User.create({
      sgid: 'u=35',
      displayname: 'LIM YONG XIANG',
      fullname: 'LIM YONG XIANG',
      email: 'limyongxiang@test.gov.sg',
      active: true,
    })
    authController = new AuthController({
      userService,
    })

    // passport and session
    app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new session.MemoryStore(),
      }),
    )
    passportConfig(app, User)
    const CustomStrategy = passportCustom.Strategy

    // Mock passport login
    const authedUser: Express.User | undefined = {
      id: 1,
      type: UserAuthType.Public,
    }
    passport.use(
      'mock',
      new CustomStrategy((req, done) => {
        done(null, authedUser)
      }),
    )
    app.get('/auth/mock', passport.authenticate('mock'))

    // passport before route
    app.use(
      path,
      routeAuth({
        controller: authController,
        authMiddleware,
      }),
    )
  })

  beforeEach(() => {
    request = supertest(app)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('loadUser', () => {
    it('should return 400 when not logged in', async () => {
      // Act
      const result = await request.get(path)
      // Assert
      expect(result.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(result.body).toStrictEqual({ message: 'User is unauthorized.' })
    })

    it('should return 200 with user data when logged in', async () => {
      // Arrange
      userService.loadUser.mockReturnValueOnce(mockUser)
      const session = await createAuthedSession(request)

      // Act
      const result = await session.get(path)

      // Assert
      expect(result.status).toEqual(StatusCodes.OK)
      // Body should be an user object.
      expect(result.body).toMatchObject({
        // Required since that's how the data is sent out from the application.
        fullname: mockUser.fullname,
        id: mockUser.id,
      })
    })

    it('should return 400 if logged out after logging in', async () => {
      // Log in user
      // Arrange
      userService.loadUser.mockReturnValueOnce(mockUser)
      const session = await createAuthedSession(request)

      // Act
      const result = await session.get(path)
      // Assert
      expect(result.status).toEqual(StatusCodes.OK)

      // Attempt to load user after logged out
      // Act
      request = await logoutSession(request)
      const logoutResult = await request.get(path)
      // Assert
      expect(logoutResult.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(logoutResult.body).toStrictEqual({
        message: 'User is unauthorized.',
      })
    })
  })

  describe('/sgid/login', () => {
    it('should return redirect with well-formed sgid url', async () => {
      // Act
      const result = await request.get('/auth/sgid/login')
      const resultLocation = parse(result.header.location.split('?')[1])

      // Assert
      expect(result.status).toEqual(StatusCodes.MOVED_TEMPORARILY)
      expect(resultLocation).toHaveProperty('response_type', 'code')
      expect(resultLocation).toHaveProperty('scope', 'openid myinfo.name')
      expect(resultLocation).toHaveProperty('client_id')
      expect(resultLocation).toHaveProperty('redirect_uri')
      expect(resultLocation).toHaveProperty('state')
    })
  })

  describe('/callback', () => {
    it('should return redirect if no code and state params', async () => {
      // Act
      const result = await request.get('/auth/callback')
      const resultLocation = parse(result.header.location.split('?')[1])

      // Assert
      expect(result.status).toEqual(StatusCodes.MOVED_TEMPORARILY)
      expect(resultLocation).toHaveProperty('response_type', 'code')
      expect(resultLocation).toHaveProperty('scope', 'openid myinfo.name')
      expect(resultLocation).toHaveProperty('client_id')
      expect(resultLocation).toHaveProperty('redirect_uri')
      expect(resultLocation).toHaveProperty('state')
    })
  })
})
