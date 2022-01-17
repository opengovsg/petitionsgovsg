import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Model, Sequelize } from 'sequelize'
import { checkOwnershipUsing } from '../../../middleware/checkOwnership'
import supertest from 'supertest'
import { Post, PostStatus, User, Signature } from '~shared/types/base'
import { ControllerHandler } from '../../../types/response-handler'
import { Creation, ModelDef } from '../../../types/sequelize'
import {
  createTestDatabase,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'
import { SignatureController } from '../signature.controller'
import { routeSignatures } from '../signature.routes'
import { SignatureService } from '../signature.service'
import { okAsync } from 'neverthrow'
import { UserAuthType } from '~shared/types/api'

describe('/signatures', () => {
  let user: User
  let post: Post
  let signature: Model<Signature, Creation<Signature>> & Signature

  let db: Sequelize
  let Post: ModelDef<Post>
  let Signature: ModelDef<Signature>

  const authService = {
    hasPermissionToEditPost: jest.fn(),
  }

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined = undefined
  const authenticate: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    next()
  }

  const app = express()
  const request = supertest(app)

  const searchSyncService = {
    createPost: jest.fn(),
    updatePost: jest.fn(),
  }

  beforeAll(async () => {
    db = await createTestDatabase()
    Post = getModelDef<Post>(db, ModelName.Post)
    Signature = getModelDef<Signature>(db, ModelName.Signature)
    const User = getModelDef<User>(db, ModelName.User)

    const signatureService = new SignatureService({
      Post,
      Signature,
      sequelize: db,
    })
    const controller = new SignatureController({
      signatureService,
      authService,
    })

    const checkOwnership = checkOwnershipUsing({ Post, User, Signature })

    app.use(express.json())
    app.use(
      routeSignatures({
        controller,
        authMiddleware: { authenticate },
        checkOwnership,
      }),
    )

    user = await User.create({
      sgid: 'u=34',
      fullname: 'Tan Ah Wee',
      displayname: 'Mr. Tan',
      email: 'tanahwee@test.gov.sg',
      active: true,
    })
    await User.update({ id: 1 }, { where: { id: null } })
  })

  beforeEach(async () => {
    authUser = { id: user.id, type: UserAuthType.Public }
    await Post.destroy({ truncate: true })
    await Signature.destroy({ truncate: true })
    post = await Post.create({
      title: 'Post',
      summary: 'summary',
      userId: user.id,
      reason: null,
      request: null,
      references: null,
      status: PostStatus.Closed,
      fullname: 'Mr. Tan',
    })
    signature = await Signature.create({
      comment: 'Comment Body',
      userId: user.id,
      postId: post.id,
      fullname: 'Mr. Tan',
    })
    jest.resetAllMocks()
    authService.hasPermissionToEditPost.mockResolvedValue(true)
  })

  describe('GET /:id', () => {
    it('returns OK on valid query', async () => {
      const signatures = [
        {
          ...signature.toJSON(),
          createdAt: (signature.createdAt as Date).toISOString(),
          updatedAt: (signature.updatedAt as Date).toISOString(),
        },
      ]
      const response = await request.get(`/${post.id}`)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(signatures)
    })
  })

  describe('POST /:id', () => {
    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined

      const response = await request
        .post(`/${post.id}`)
        .send({ text: signature.comment })

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
    })

    it('returns OK on valid submission', async () => {
      const { id, comment: text } = signature
      await Signature.destroy({ where: { id } })

      searchSyncService.updatePost.mockResolvedValue(okAsync({}))

      const response = await request.post(`/${post.id}`).send({ text })

      const newSignatureId = Number(response.body)
      const newSignature = await Signature.findByPk(newSignatureId)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(newSignature?.comment).toStrictEqual(text)
      expect(newSignature?.id).not.toBe(id)
    })
  })

  describe('DELETE /:id', () => {
    it('returns OK on valid query', async () => {
      const response = await request.delete(`/${signature.id}`)
      const deletedSignature = await Signature.findByPk(signature.id)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(deletedSignature).toBeNull()
    })
  })
})
