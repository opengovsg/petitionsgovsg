import express from 'express'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { ControllerHandler } from '@/types/response-handler'
import { mockUserJWT } from '../../../util/db/data/user'
import { AuthMiddleware } from '../auth.middleware'

describe('auth.middleware', () => {
  // Set up auth middleware to inject user
  let jwt: { jwt: string } | undefined
  const authMiddleware = new AuthMiddleware()

  // Middleware to attach cookies
  const middleware: ControllerHandler = (req, _res, next) => {
    req['cookies'] = jwt
    next()
  }

  const authPath = '/auth'

  const app = express()
  app.use(express.json())
  app.use(middleware)
  app.get(authPath, authMiddleware.authenticate)
  app.use(function (req, res) {
    res.end()
  })
  const request = supertest(app)

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  describe('authenticate', () => {
    it('should pass on to the next handler if authenticated', async () => {
      jwt = mockUserJWT

      const response = await request.get(authPath)

      expect(response.status).toEqual(StatusCodes.OK)
    })

    it('returns UNAUTHORIZED on no user', async () => {
      jwt = undefined

      const response = await request.get(authPath)

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
  })
})
