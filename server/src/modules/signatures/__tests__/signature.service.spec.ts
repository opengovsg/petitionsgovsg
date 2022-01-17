import { okAsync } from 'neverthrow'
import { Sequelize } from 'sequelize'
import { Post, PostStatus, User, Signature } from '~shared/types/base'
import { ModelDef } from '../../../types/sequelize'
import {
  createTestDatabase,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'
import { SignatureService } from '../signature.service'

describe('AnswersService', () => {
  let user: User
  let post: Post
  let signature: Signature

  let db: Sequelize
  let Post: ModelDef<Post>
  let Signature: ModelDef<Signature>
  let service: SignatureService

  const searchSyncService = {
    createPost: jest.fn(),
    updatePost: jest.fn(),
  }

  beforeAll(async () => {
    db = await createTestDatabase()
    Post = getModelDef<Post>(db, ModelName.Post)
    Signature = getModelDef<Signature>(db, ModelName.Signature)
    service = new SignatureService({
      Post,
      Signature,
      sequelize: db,
    })

    const User = getModelDef<User>(db, ModelName.User)
    user = await User.create({
      sgid: 'u=34',
      fullname: 'Tan Ah Wee',
      displayname: 'Mr. Tan',
      email: 'tanahwee@test.gov.sg',
      active: true,
    })
  })

  beforeEach(async () => {
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
    })
    signature = await Signature.create({
      comment: 'The reason why I support',
      userId: user.id,
      postId: post.id,
    })
  })

  afterAll(async () => {
    await db.close()
  })

  describe('listAnswers', () => {
    it('returns only answers associated with specified id', async () => {
      const otherPost = await Post.create({
        title: 'Other Post',
        summary: 'summary',
        userId: user.id,
        reason: null,
        request: null,
        references: null,
        status: PostStatus.Closed,
      })
      const otherSignature = await Signature.create({
        comment: 'Other Signature Body',
        userId: user.id,
        postId: otherPost.id,
      })

      const signatures = await service.listSignatures(post.id)

      expect(signatures.length).toEqual(1)
      expect(signatures.some((a) => a.id === signature.id)).toBe(true)
      expect(signatures.some((a) => a.id === otherSignature.id)).toBe(false)
    })
  })

  describe('createSignature', () => {
    it('creates a signature for the given postId', async () => {
      const comment = 'Second Signature Body'
      const attributes = {
        comment,
        postId: post.id,
        userId: user.id,
      }

      searchSyncService.updatePost.mockResolvedValue(okAsync({}))

      const signatureId = await service.createSignature(attributes)
      const signature = await Signature.findByPk(signatureId)

      const updatedPost = await Post.findByPk(post.id)

      expect(signature).toMatchObject(attributes)
      expect(updatedPost?.status).toEqual(PostStatus.Open)
    })
  })
  describe('deleteSignature', () => {
    it('deletes the specified Signature', async () => {
      await service.deleteSignature(signature.id)

      const deletedSignature = await Signature.findByPk(signature.id)

      expect(deletedSignature).toBeNull()
    })
  })
})
