import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { SubscriptionController } from '../subscription.controller'
import { POST_ID } from '@/util/db/constants'
import { ControllerHandler } from '@/types/response-handler'
import { mockUser, mockUserJWT } from '@/util/db/data/user'
import { errAsync } from 'neverthrow'
import { DatabaseError } from '@/modules/core/core.errors'
import { mockSubscription } from '@/util/db/data/subscription'

describe('SubscriptionController', () => {
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

  const subscriptionService = {
    createSubscription: jest.fn(),
  }

  const subscriptionController = new SubscriptionController({
    subscriptionService,
  })

  const postPath = `/${POST_ID}`

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('createSubscription', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/:id', subscriptionController.createSubscription)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      errors = noErrors
      subscriptionService.createSubscription.mockResolvedValue(
        mockSubscription.id,
      )
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

      const response = await request.post(postPath).send({ email: 'bademail' })

      expect(subscriptionService.createSubscription).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request
        .post(postPath)
        .send({ email: mockSubscription.email })

      expect(subscriptionService.createSubscription).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission', async () => {
      const subscriptionAttributes = {
        email: mockSubscription.email,
        postId: mockSubscription.postId,
      }

      const response = await request
        .post(postPath)
        .send({ email: mockSubscription.email })

      expect(subscriptionService.createSubscription).toHaveBeenCalledWith(
        subscriptionAttributes,
      )
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSubscription.id)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      subscriptionService.createSubscription.mockRejectedValue(
        errAsync(new DatabaseError()),
      )
      const subscriptionAttributes = {
        email: mockSubscription.email,
        postId: mockSubscription.postId,
      }

      const response = await request
        .post(postPath)
        .send({ email: mockSubscription.email })

      expect(subscriptionService.createSubscription).toHaveBeenCalledWith(
        subscriptionAttributes,
      )
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })
})
