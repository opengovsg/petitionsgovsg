import { Addressee } from '~shared/types/base'
import { ModelDef } from '@/types/sequelize'

export type AddresseeDto = Pick<Addressee, 'id' | 'name' | 'shortName'>

export class AddresseeService {
  private Addressee: ModelDef<Addressee>

  constructor({ Addressee }: { Addressee: ModelDef<Addressee> }) {
    this.Addressee = Addressee
  }

  /**
   * Lists all addressees
   */
  listAddressees = async (): Promise<AddresseeDto[]> => {
    const addressees = (await this.Addressee.findAll({
      attributes: ['id', 'name', 'shortName'],
    })) as AddresseeDto[]
    return addressees
  }
}
