import { Sequelize, DataTypes, Model, ModelCtor } from 'sequelize'
import { ModelDef } from '../types/sequelize'
import { Post, Signature as SignatureBaseDto } from '~shared/types/base'
import { User } from './users.model'

// TODO (#225): Remove this and replace ModelCtor below with ModelDefined
export interface Signature extends Model, SignatureBaseDto {}

// constructor
export const defineSignature = (
  sequelize: Sequelize,
  { User, Post }: { User: ModelCtor<User>; Post: ModelDef<Post> },
): ModelCtor<Signature> => {
  const Signature: ModelCtor<Signature> = sequelize.define('signature', {
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  // Define associations for Signature
  User.hasMany(Signature)
  Signature.belongsTo(User)
  Post.hasMany(Signature)
  Signature.belongsTo(Post)

  return Signature
}