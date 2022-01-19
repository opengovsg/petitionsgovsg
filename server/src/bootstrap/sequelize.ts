import { Sequelize } from 'sequelize'

import { defineSignature, definePost, defineAddressee } from '../models'
import { dbConfig } from './config/database'

export const sequelize = new Sequelize({ ...dbConfig, logging: false })

export const { Addressee } = defineAddressee(sequelize)
export const { Post } = definePost(sequelize, { Addressee })
export const Signature = defineSignature(sequelize, { Post })

export default sequelize
