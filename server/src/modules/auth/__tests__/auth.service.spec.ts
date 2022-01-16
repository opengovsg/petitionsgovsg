import minimatch from 'minimatch'
import { ModelCtor, Sequelize } from 'sequelize'
import { Post, PostStatus } from '~shared/types/base'
import { User as UserModel } from '../../../models'
import { ModelDef } from '../../../types/sequelize'
import {
  createTestDatabase,
  getModel,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'
import { AuthService } from '../auth.service'

describe('AuthService', () => {
  const emailValidator = new minimatch.Minimatch('*')
  let db: Sequelize
  let User: ModelCtor<UserModel>
  let Post: ModelDef<Post>

  let authService: AuthService
  let mockUser: UserModel

  beforeAll(async () => {
    db = await createTestDatabase()
    User = getModel<UserModel>(db, ModelName.User)
    Post = getModelDef<Post>(db, ModelName.Post)
    mockUser = await User.create({
      sgid: 'u=35',
      displayname: 'LIM YONG XIANG',
      fullname: 'LIM YONG XIANG',
      email: 'limyongxiang@test.gov.sg',
      active: true,
    })
    authService = new AuthService({
      emailValidator,
      User,
      Post,
    })
  })
  describe('hasPermissionToEditPost', () => {
    afterEach(async () => {
      Post.destroy({ truncate: true })
    })
    it('returns true if user has valid permissions to edit post', async () => {
      const { id: postId } = await Post.create({
        title: 'Question belongs to user',
        summary: 'summary',
        status: PostStatus.Open,
        userId: mockUser.id,
        reason: null,
        request: null,
        references: null,
      })

      const hasPermission = await authService.hasPermissionToEditPost(
        mockUser.id,
        postId,
      )

      expect(hasPermission).toBe(true)
    })

    it('returns false if user has valid permissions to edit post', async () => {
      const { id: postId } = await Post.create({
        title: 'Question belongs to user',
        summary: 'summary',
        status: PostStatus.Open,
        userId: mockUser.id,
        reason: null,
        request: null,
        references: null,
      })

      const diffMockUser = mockUser.id + 1

      const hasPermission = await authService.hasPermissionToEditPost(
        diffMockUser,
        postId,
      )

      expect(hasPermission).toBe(false)
    })
  })
})
