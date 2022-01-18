import { Sequelize, DataTypes, Model, ModelCtor } from 'sequelize'
import { ModelDef } from '../types/sequelize'
import { Post, Signature as SignatureBaseDto } from '~shared/types/base'

// TODO (#225): Remove this and replace ModelCtor below with ModelDefined
export interface Signature extends Model, SignatureBaseDto {}

// constructor
export const defineSignature = (
  sequelize: Sequelize,
  { Post }: { Post: ModelDef<Post> },
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
    hashedUserSgid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // Define associations for Signature
  Post.hasMany(Signature)
  Signature.belongsTo(Post)

  return Signature
}
