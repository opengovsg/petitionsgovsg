import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { routeSubscriptions } from '../subscription.routes'
import { SubscriptionService } from '../subscription.service'
import { SubscriptionController } from '../subscription.controller'
import { ControllerHandler } from '@/types/response-handler'
import { mockUser, mockUserJWT } from '@/util/db/data/user'
import { POST_ID } from '@/util/db/constants'
import { mockSubscription } from '@/util/db/data/subscription'

describe('/subscriptions', () => {
  let db: SequelizeWithModels

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const authenticate: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    req['cookies'] = jwt
    next()
  }

  const app = express()
  const request = supertest(app)
  app.use(express.json())

  beforeAll(async () => {
    db = await createTestDatabase()

    const subscriptionService = new SubscriptionService({
      Subscription: db.Subscription,
      sequelize: db.sequelize,
    })
    const controller = new SubscriptionController({
      subscriptionService,
    })
    app.use(
      routeSubscriptions({
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

  describe('Post /:id', () => {
    it('returns OK on valid submission', async () => {
      const response = await request
        .post(`/${POST_ID}`)
        .send({ email: mockSubscription.email })

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined
      const response = await request
        .post(`/${POST_ID}`)
        .send({ email: mockSubscription.email })

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toMatchSnapshot()
    })
    it('returns BAD REQUEST on bad email', async () => {
      const response = await request.post(`/${POST_ID}`).send({ email: null })

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })
  })
})
