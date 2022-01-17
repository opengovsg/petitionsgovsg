import minimatch from 'minimatch'
import { Model, ModelCtor, Sequelize } from 'sequelize'
import { Creation, ModelDef } from '../types/sequelize'
import { defineSignature, defineUser, definePost } from '../models'

export enum ModelName {
  Signature = 'signature',
  Post = 'post',
  User = 'user',
}

/**
 * Connect to a in-memory database
 */
export const createTestDatabase = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false })
  const emailValidator = new minimatch.Minimatch('*')

  const { User } = defineUser(sequelize, {
    emailValidator,
  })
  const { Post } = definePost(sequelize, {
    User,
  })
  const Signature = defineSignature(sequelize, { User, Post })

  await sequelize.sync()

  return sequelize
}

export function getModel<T extends Model>(
  sequelize: Sequelize,
  modelName: ModelName,
): ModelCtor<T> {
  return sequelize.models[modelName] as ModelCtor<T>
}

export function getModelDef<T, C = Creation<T>>(
  sequelize: Sequelize,
  modelName: ModelName,
): ModelDef<T, C> {
  return sequelize.models[modelName] as ModelDef<T, C>
}
