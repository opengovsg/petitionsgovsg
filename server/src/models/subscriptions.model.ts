import { Sequelize, DataTypes, Model } from 'sequelize'
import { ModelDef } from '@/types/sequelize'
import { Post, Subscription as SubscriptionBaseDto } from '~shared/types/base'

export interface Subscription extends Model, SubscriptionBaseDto {}

// constructor
export const defineSubscription = (
  sequelize: Sequelize,
  { Post }: { Post: ModelDef<Post> },
): ModelDef<Subscription> => {
  const Subscription: ModelDef<Subscription> = sequelize.define(
    'subscription',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  )

  // Define associations for Subscription
  Post.hasMany(Subscription)
  Subscription.belongsTo(Post)

  return Subscription
}
