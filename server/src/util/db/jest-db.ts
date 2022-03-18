import { Sequelize } from 'sequelize'
import { Creation, ModelDef } from '@/types/sequelize'
import {
  defineSignature,
  definePost,
  defineAddressee,
  defineSubscription,
} from '@/models'
import { mockPosts } from './data/post'
import { mockAddressees } from './data/addressee'
import { mockSignatures } from './data/signature'
import {
  Signature as SignatureModel,
  Addressee as AddresseeModel,
  Post as PostModel,
  Subscription as SubscriptionModel,
} from '~shared/types/base'
import { dbConfig } from '@/bootstrap/config/database'

export enum ModelName {
  Signature = 'signature',
  Post = 'post',
  User = 'user',
  Addressee = 'addressee',
  Subscription = 'subscription',
}

export type SequelizeWithModels = {
  sequelize: Sequelize
  Addressee: ModelDef<AddresseeModel, Creation<AddresseeModel>>
  Post: ModelDef<PostModel, Creation<PostModel>>
  Signature: ModelDef<SignatureModel, Creation<SignatureModel>>
  Subscription: ModelDef<SubscriptionModel, Creation<SubscriptionModel>>
}

/**
 * Connect to a in-memory database
 */
export const createTestDatabase = async (): Promise<SequelizeWithModels> => {
  const sequelize = new Sequelize({ ...dbConfig, logging: false })

  const { Addressee } = defineAddressee(sequelize)
  const { Post } = definePost(sequelize, { Addressee })
  const Signature = defineSignature(sequelize, { Post })
  const Subscription = defineSubscription(sequelize, { Post })

  const models = {
    Addressee,
    Post,
    Signature,
    Subscription,
  }

  const db = { ...models, sequelize }
  await resetAndSetupDb(db)
  return db
}

/**
 * Clears and re-populates database with test fixtures
 */
export const resetAndSetupDb = async (
  db: SequelizeWithModels,
): Promise<void> => {
  await resetTestDb(db)
  await populateTestDb(db)
}

/**
 * Clears database
 */
const resetTestDb = async (
  db: SequelizeWithModels,
): Promise<SequelizeWithModels> => {
  // Set force to true to clear DB if tables exist
  await db.sequelize.sync({ force: true })
  return db
}

/**
 * Populates database with mock data
 */
const populateTestDb = async (
  db: SequelizeWithModels,
): Promise<SequelizeWithModels> => {
  await db.Addressee.bulkCreate(mockAddressees)
  await db.Post.bulkCreate(mockPosts)
  await db.Signature.bulkCreate(mockSignatures)
  // Id auto-increment issue: https://stackoverflow.com/a/44708862/16093716
  await db.sequelize.query(
    `SELECT setval('signatures_id_seq', max(id)) FROM signatures;`,
  )
  return db
}

export function getModelDef<T, C = Creation<T>>(
  sequelize: Sequelize,
  modelName: ModelName,
): ModelDef<T, C> {
  return sequelize.models[modelName] as ModelDef<T, C>
}
