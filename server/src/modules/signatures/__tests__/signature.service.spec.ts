import { mockSignature } from '../../../util/db/data/signature'
import { POST_ID } from '../../../util/db/constants'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { SignatureService } from '../signature.service'

describe('SignatureService', () => {
  let service: SignatureService
  let db: SequelizeWithModels

  beforeAll(async () => {
    db = await createTestDatabase()
    service = new SignatureService({
      Post: db.Post,
      Signature: db.Signature,
      sequelize: db.sequelize,
    })
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listSignatures', () => {
    it('returns only signatures associated with specified post id', async () => {
      const signatures = await service.listSignatures(POST_ID)

      expect(signatures).toMatchSnapshot()
    })
  })

  describe('createSignature', () => {
    it('returns a signature for specified post id', async () => {
      const signatureId = await service.createSignature(mockSignature)
      const signature = await db.Signature.findByPk(signatureId)

      expect(signature?.get()).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('checkUserHasSigned', () => {
    it('returns a signature if user has signed a petition', async () => {
      // Arrange: User signs a petition
      const attributes = {
        postId: POST_ID,
        hashedUserSgid: 'hashedUserSgid',
        comment: null,
        fullname: null,
      }
      await service.createSignature(attributes)

      // Act: Check if user has signed petition
      const signature = await service.checkUserHasSigned(
        POST_ID,
        attributes.hashedUserSgid,
      )

      expect(signature).toMatchObject(attributes)
      expect(signature).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('returns null if user has not signed a petition', async () => {
      const signature = await service.checkUserHasSigned(
        POST_ID,
        'hashedUserSgid',
      )

      expect(signature).toEqual(null)
      expect(signature).toMatchSnapshot()
    })
  })
})
