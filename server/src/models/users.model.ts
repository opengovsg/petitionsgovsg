import { Sequelize, DataTypes, Model, ModelCtor } from 'sequelize'

import { IMinimatch } from 'minimatch'
import { User as UserBaseDto } from '~shared/types/base'

const USER_MODEL_NAME = 'user'

export interface User extends Model, UserBaseDto {}

interface Settable {
  setDataValue(key: string, value: unknown): void
}

// constructor
export const defineUser = (
  sequelize: Sequelize,
  { emailValidator }: { emailValidator: IMinimatch },
): { User: ModelCtor<User> } => {
  const User: ModelCtor<User> = sequelize.define(USER_MODEL_NAME, {
    sgid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
        is: emailValidator.makeRe(),
      },
      allowNull: true,
      set(this: Settable, email: string) {
        // save email as lowercase for ease of checks
        this.setDataValue('email', email.trim().toLowerCase())
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  })

  return { User }
}
