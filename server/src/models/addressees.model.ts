import { DataTypes, Model, Sequelize } from 'sequelize'
import { ModelDef } from '../types/sequelize'
import { Addressee as AddresseeBaseDto } from '~shared/types/base'

export interface Addressee extends Model, AddresseeBaseDto {}

// constructor
export const defineAddressee = (
  sequelize: Sequelize,
): { Addressee: ModelDef<Addressee> } => {
  const Addressee: ModelDef<Addressee> = sequelize.define('addressee', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  return { Addressee }
}
