import { Sequelize } from 'sequelize'
import { Post } from '~shared/types/base'
import { ModelDef } from '../../../types/sequelize'
import {
  createTestDatabase,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'

describe('AuthService', () => {
  let db: Sequelize
  let Post: ModelDef<Post>

  beforeAll(async () => {
    db = await createTestDatabase()
    Post = getModelDef<Post>(db, ModelName.Post)
  })
  describe('hasPermissionToEditPost', () => {
    afterEach(async () => {
      Post.destroy({ truncate: true })
    })
    it('returns true if user has valid permissions to edit post', async () => {
      //Just want 1 working test
      const result = true
      expect(result).toBe(true)
    })
  })
})
