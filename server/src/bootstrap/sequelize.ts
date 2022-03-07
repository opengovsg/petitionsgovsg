import { Sequelize } from 'sequelize'

import {
  defineSignature,
  definePost,
  defineAddressee,
  defineSubscription,
} from '@/models'
import { dbConfig } from './config/database'

export const sequelize = new Sequelize({ ...dbConfig, logging: false })

export const { Addressee } = defineAddressee(sequelize)
export const { Post } = definePost(sequelize, { Addressee })
export const Signature = defineSignature(sequelize, { Post })
export const Subscription = defineSubscription(sequelize, { Post })

export default sequelize
