import { DataTypes, Model, Sequelize } from 'sequelize'
import { ModelDef } from '@/types/sequelize'
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
    openToPublic: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    officerEmails: {
      allowNull: true,
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  })

  return { Addressee }
}
