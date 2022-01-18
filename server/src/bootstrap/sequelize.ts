import { Sequelize } from 'sequelize'

import { defineSignature, definePost, defineUser } from '../models'
import { dbConfig } from './config/database'

import { emailValidator } from './email-validator'

export const sequelize = new Sequelize({ ...dbConfig, logging: false })

export const { User } = defineUser(sequelize, {
  emailValidator,
})
export const { Post } = definePost(sequelize, {
  User,
})
export const Signature = defineSignature(sequelize, { Post })

export default sequelize
