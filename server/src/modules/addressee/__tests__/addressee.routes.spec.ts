import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { routeAddressees } from '../addressee.routes'
import { AddresseeController } from '../addressee.controller'
import { AddresseeService } from '../addressee.service'

describe('/addressees', () => {
  let db: SequelizeWithModels

  const app = express()
  const request = supertest(app)
  app.use(express.json())

  beforeAll(async () => {
    db = await createTestDatabase()
    const addresseeService = new AddresseeService({ Addressee: db.Addressee })
    const controller = new AddresseeController({ addresseeService })
    app.use(routeAddressees({ controller }))
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('Get /:id', () => {
    it('retrieves all addressees', async () => {
      const response = await request.get(`/`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchSnapshot()
    })
  })
})
