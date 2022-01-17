import { ModelCtor, Sequelize } from 'sequelize'
import { Post, PostStatus } from '~shared/types/base'
import { User as UserModel, Signature as SignatureModel } from '../../../models'
import { ModelDef } from '../../../types/sequelize'
import { SortType } from '../../../types/sort-type'
import {
  createTestDatabase,
  getModel,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'
import { MissingPublicPostError } from '../post.errors'
import { PostService } from '../post.service'

describe('PostService', () => {
  let db: Sequelize
  let Signature: ModelCtor<SignatureModel>
  let Post: ModelDef<Post>
  let User: ModelCtor<UserModel>
  let postService: PostService
  const mockPosts: Post[] = []
  let mockUser: UserModel

  beforeAll(async () => {
    db = await createTestDatabase()
    Signature = getModel<SignatureModel>(db, ModelName.Signature)
    Post = getModelDef<Post>(db, ModelName.Post)
    User = getModel<UserModel>(db, ModelName.User)
    postService = new PostService({
      Signature,
      Post,
      User,
      sequelize: db,
    })
    mockUser = await User.create({
      sgid: 'u=34',
      fullname: 'Tan Ah Wee',
      displayname: 'Mr. Tan',
      email: 'tanahwee@test.gov.sg',
      active: true,
    })
    for (let title = 1; title <= 20; title++) {
      const mockPost = await Post.create({
        title: title.toString(),
        summary: 'summary',
        status: PostStatus.Open,
        userId: mockUser.id,
        reason: null,
        request: null,
        references: null,
        fullname: 'Mr. Tan',
      })
      mockPosts.push(mockPost)
    }
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('listPosts', () => {
    it('should return all data with no page query', async () => {
      // Act
      const result = await postService.listPosts({
        sort: SortType.Top,
      })

      // Assert
      expect(result.posts.length).toStrictEqual(mockPosts.length)
      expect(result.totalItems).toStrictEqual(mockPosts.length)
    })

    it('should return first 10 posts with query on page 1, size 10', async () => {
      // Act
      const result = await postService.listPosts({
        sort: SortType.Top,
        page: 1,
        size: 10,
      })
      // Assert
      expect(result.posts.length).toStrictEqual(10)
      expect(result.totalItems).toStrictEqual(mockPosts.length)
      expect(result.posts[0].title).toBe(mockPosts[0].title)
      expect(result.posts[9].title).toBe(mockPosts[9].title)
    })

    it('should return 11-15th posts with query on page 3, size 5', async () => {
      // Act
      const result = await postService.listPosts({
        sort: SortType.Top,
        page: 3,
        size: 5,
      })
      // Assert
      expect(result.posts.length).toStrictEqual(5)
      expect(result.totalItems).toStrictEqual(mockPosts.length)
      expect(result.posts[0].title).toStrictEqual(mockPosts[10].title)
      expect(result.posts[4].title).toStrictEqual(mockPosts[14].title)
    })
  })

  describe('getSinglePost', () => {
    it('gets single post with associated user', async () => {
      const post = await postService.getSinglePost(mockPosts[0].id)
      expect(post.title).toBe(mockPosts[0].title)
    })
    it('throws if public post does not exist', async () => {
      const badPostId = mockPosts[mockPosts.length - 1].id + 20
      await expect(postService.getSinglePost(badPostId)).rejects.toStrictEqual(
        new MissingPublicPostError(),
      )
    })
  })

  describe('createPost', () => {
    it('creates post on good input', async () => {
      const postParams = {
        title: 'Title',
        summary: 'summary',
        userId: mockUser.id,
        status: PostStatus.Open,
        reason: null,
        request: null,
        references: null,
      }

      const postId = await postService.createPost(postParams)

      const post = await Post.findByPk(postId)
      expect(post).toBeDefined()
    })
  })

  describe('deletePost', () => {
    it('archives post successfully', async () => {
      const postId = mockPosts[0].id
      const postUpdateStatus = await postService.deletePost(postId)
      expect(postUpdateStatus).toBeUndefined()
    })

    afterEach(() => jest.clearAllMocks())
  })
})
