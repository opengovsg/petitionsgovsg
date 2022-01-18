import { Sequelize } from 'sequelize'

import { defineSignature, definePost } from '../models'
import { dbConfig } from './config/database'

export const sequelize = new Sequelize({ ...dbConfig, logging: false })

export const { Post } = definePost(sequelize)
export const Signature = defineSignature(sequelize, { Post })

export default sequelize
