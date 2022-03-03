import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { SubscriptionService } from '../subscription.service'
import { mockSubscription } from '@/util/db/data/subscription'

describe('SubscriptionService', () => {
  let service: SubscriptionService
  let db: SequelizeWithModels

  beforeAll(async () => {
    db = await createTestDatabase()
    service = new SubscriptionService({
      Subscription: db.Subscription,
      sequelize: db.sequelize,
    })
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('createSuscription', () => {
    it('creates subscription for specified post id', async () => {
      const subscriptionId = await service.createSubscription(mockSubscription)
      const subscription = await db.Subscription.findByPk(subscriptionId)

      expect(subscription?.get()).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })
})
