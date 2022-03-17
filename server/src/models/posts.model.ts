import { DataTypes, Model, Sequelize } from 'sequelize'
import { Post as PostBaseDto, PostStatus, Addressee } from '~shared/types/base'
import { ModelDef } from '@/types/sequelize'

export interface Post extends Model, PostBaseDto {}

// constructor
export const definePost = (
  sequelize: Sequelize,
  { Addressee }: { Addressee: ModelDef<Addressee> },
): { Post: ModelDef<Post> } => {
  const Post: ModelDef<Post> = sequelize.define('post', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    references: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        PostStatus.Open,
        PostStatus.Closed,
        PostStatus.Draft,
      ),
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedUserSgid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signatureOptions: {
      allowNull: false,
      type: DataTypes.JSONB,
      defaultValue: ['support', 'oppose'],
    },
    auditTrail: {
      allowNull: false,
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  })

  // Define associations for Post
  Addressee.hasOne(Post)
  Post.belongsTo(Addressee)
  return { Post }
}
