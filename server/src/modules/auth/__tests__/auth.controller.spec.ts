import express from 'express'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { ControllerHandler } from '../../../types/response-handler'
import { AuthController } from '../auth.controller'
import { Sequelize } from 'sequelize'
import { createTestDatabase } from '../../../util/jest-db'
import { UserAuthType } from '~shared/types/api'

jest.mock('../../../util/hash')

// Mock services invoked by authController
const userService = {
  loadUser: jest.fn(),
  loadUserBySgid: jest.fn(),
}

let authController: AuthController

const path = '/auth'
// Set up auth middleware to inject user
const user: Express.User | undefined = { id: 1, type: UserAuthType.Public }
const isAuthenticated = true
const middleware: ControllerHandler = (req, res, next) => {
  req.isAuthenticated = () => isAuthenticated
  req.session = {
    passport: { id: 1 },
    regenerate: (callback) => {
      callback(null)
      return req.session
    },
    save: (callback) => {
      if (callback) callback(null)
      return req.session
    },
    id: '',
    cookie: { originalMaxAge: 240000 },
    destroy: jest.fn(),
    reload: jest.fn(),
    resetMaxAge: jest.fn(),
    touch: jest.fn(),
  }
  req.logIn = (_, callback) => {
    callback()
  }
  ;(req.user = user), next()
}

// Set up supertest
const app = express()
app.use(express.json())
app.use(middleware)
const request = supertest(app)

// Set up sequelize
let db: Sequelize

beforeAll(async () => {
  db = await createTestDatabase()
  authController = new AuthController({
    userService,
  })
  app.get(path, authController.loadUser)
  app.get(path + '/logout', authController.handleLogout)
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(async () => {
  await db.close()
})

describe('auth.controller', () => {
  describe('loadUser', () => {
    it('should return 200 when public user id is valid', async () => {
      // Arrange
      const userData = {
        sgid: 'u=35',
        displayname: 'LIM YONG XIANG',
        fullname: 'LIM YONG XIANG',
        email: 'limyongxiang@test.gov.sg',
        active: true,
      }
      userService.loadUser.mockReturnValue(userData)

      // Act
      const response = await request.get(path)

      // Assert
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(userData)
    })

    it('should return 500 if database error', async () => {
      // Arrange
      const error = new Error('Database error')
      userService.loadUser.mockImplementation(() => {
        throw error
      })

      // Act
      const response = await request.get(path)

      // Assert
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual(null)
    })
  })
})
