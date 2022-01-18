import { Sequelize, DataTypes } from 'sequelize'
import { ModelDef } from '../types/sequelize'
import { Post, Signature, User } from '~shared/types/base'

// constructor
export const defineSignature = (
  sequelize: Sequelize,
  { User, Post }: { User: ModelDef<User>; Post: ModelDef<Post> },
): ModelDef<Signature> => {
  const Signature: ModelDef<Signature> = sequelize.define('signature', {
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
