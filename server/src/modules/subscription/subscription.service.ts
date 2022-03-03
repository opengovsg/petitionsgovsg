import type { Sequelize as SequelizeType } from 'sequelize'
import { Subscription } from '~shared/types/base'
import { ModelDef } from '@/types/sequelize'

export class SubscriptionService {
  private Subscription: ModelDef<Subscription>
  private sequelize: SequelizeType

  constructor({
    Subscription,
    sequelize,
  }: {
    Subscription: ModelDef<Subscription>
    sequelize: SequelizeType
  }) {
    this.Subscription = Subscription
    this.sequelize = sequelize
  }

  /**
   * Create a subscription attached to a post
   * @param postId id of post to attach to
   * @param email subscriber's email
   * @returns id of new subscription if it is successfully created
   */
  createSubscription = async ({
    postId,
    email,
  }: Pick<Subscription, 'email' | 'postId'>): Promise<number> => {
    const subscriptionId = await this.sequelize.transaction(
      async (transaction) => {
        const subscription = await this.Subscription.create(
          {
            postId: postId,
            email: email,
          },
          { transaction },
        )
        return subscription.id
      },
    )
    return subscriptionId
  }
}
