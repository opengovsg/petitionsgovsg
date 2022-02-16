import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { AddresseeService } from '../addressee.service'

describe('AddresseeService', () => {
  let service: AddresseeService
  let db: SequelizeWithModels

  beforeAll(async () => {
    db = await createTestDatabase()
    service = new AddresseeService({ Addressee: db.Addressee })
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listAddressees', () => {
    it('returns all addressees', async () => {
      const addressees = await service.listAddressees()

      expect(addressees).toMatchSnapshot()
    })
  })
})
