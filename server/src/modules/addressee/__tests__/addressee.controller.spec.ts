import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { errAsync } from 'neverthrow'
import { DatabaseError } from '../../core/core.errors'
import { AddresseeController } from '../addressee.controller'
import { mockAddressees } from '../../../util/db/data/addressee'

describe('AddresseeController', () => {
  let db: SequelizeWithModels

  // Mock external service(s)
  const addresseeService = {
    listAddressees: jest.fn(),
  }

  const addresseeController = new AddresseeController({ addresseeService })

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listAddressees', () => {
    const app = express()
    app.get('/', addresseeController.listAddressees)
    const request = supertest(app)
    it('retrieves all addressees', async () => {
      addresseeService.listAddressees.mockResolvedValueOnce(mockAddressees)

      const response = await request.get('/')

      expect(addresseeService.listAddressees).toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockAddressees)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      addresseeService.listAddressees.mockRejectedValue(
        errAsync(new DatabaseError()),
      )

      const response = await request.get('/')

      expect(addresseeService.listAddressees).toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })
})
