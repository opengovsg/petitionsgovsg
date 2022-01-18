import { DataTypes, Model, Sequelize } from 'sequelize'
import { Post as PostBaseDto, PostStatus } from '~shared/types/base'
import { ModelDef } from '../types/sequelize'

export interface Post extends Model, PostBaseDto {}

// constructor
export const definePost = (sequelize: Sequelize): { Post: ModelDef<Post> } => {
  const Post: ModelDef<Post> = sequelize.define('post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // Define associations for Post
  return { Post }
}
