import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '@/util/db/jest-db'
import { PostService } from '../post.service'
import { SortType } from '~shared/types/base'
import { mockPost } from '@/util/db/data/post'
import { INVALID_POST_ID, POST_ID } from '@/util/db/constants'
import { Post, PostStatus } from '~shared/types/base'
import {
  MissingPublicPostError,
  PostUpdateError,
  AddresseeDoesNotExistError,
} from '../post.errors'

/**
 * TODO: getPaginatedPosts
 */

describe('PostService', () => {
  let service: PostService
  let db: SequelizeWithModels

  beforeAll(async () => {
    db = await createTestDatabase()
    service = new PostService({
      Signature: db.Signature,
      Post: db.Post,
      Addressee: db.Addressee,
      sequelize: db.sequelize,
    })
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listPosts', () => {
    beforeEach(async () => {
      const newlyCreatedPost = {
        ...mockPost,
        createdAt: '2022-02-02T00:00:00.000Z',
        updatedAt: '2022-02-02T00:00:00.000Z',
      }
      await db.Post.create(newlyCreatedPost, { silent: true })
    })

    it('returns posts ordered by date created', async () => {
      const post = await service.listPosts({ sort: SortType.Newest })

      expect(post).toMatchSnapshot()
    })

    it('returns posts ordered by date created (oldest)', async () => {
      const post = await service.listPosts({ sort: SortType.Oldest })

      expect(post).toMatchSnapshot()
    })

    it('returns posts ordered by signature count', async () => {
      const post = await service.listPosts({ sort: SortType.MostSignatures })

      expect(post).toMatchSnapshot()
    })

    it('returns posts ordered by signature count (least)', async () => {
      const post = await service.listPosts({ sort: SortType.LeastSignatures })

      expect(post).toMatchSnapshot()
    })
  })

  describe('getSinglePost', () => {
    let closedPost: Post
    beforeEach(async () => {
      const mockClosedPost = {
        ...mockPost,
        status: PostStatus.Closed,
      }
      closedPost = await db.Post.create(mockClosedPost)
    })
    it('returns a single post with specified post id', async () => {
      const post = await service.getSinglePost(POST_ID)

      expect(post).toMatchSnapshot()
    })

    it('throws an error if post is not public', async () => {
      const postError = service.getSinglePost(closedPost.id)

      await expect(postError).rejects.toStrictEqual(
        new MissingPublicPostError(),
      )
      await expect(postError).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('createPost', () => {
    it('creates post on good input', async () => {
      const postParams = {
        title: 'Title should be concise',
        summary: 'A short description or summary ',
        reason: 'Reason for post goes here',
        request: 'Request for post goes her',
        hashedUserSgid: 'wxyz',
        fullname: 'John Doe',
        addresseeId: 1,
        email: 'john@email.com',
        salt: 'abcdef',
        profile: null,
        references: null,
      }

      const postId = await service.createPost(postParams)

      const post = await db.Post.findByPk(postId)
      expect(post).toBeDefined()
      expect(post?.get()).toMatchSnapshot({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('throws on bad addressee', async () => {
      const postParams = {
        title: 'Title should be concise',
        summary: 'A short description or summary',
        reason: 'Reason for post goes here',
        request: 'Request for post goes her',
        hashedUserSgid: 'wxyz',
        fullname: 'John Doe',
        addresseeId: -1,
        email: 'john@email.com',
        salt: 'abcdef',
        profile: null,
        references: null,
      }

      const postError = service.createPost(postParams)

      await expect(postError).rejects.toStrictEqual(
        new AddresseeDoesNotExistError(),
      )
      await expect(postError).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('updatePost', () => {
    it('updates post on good input', async () => {
      const postParams = {
        id: POST_ID,
        title: 'Title should be even more concise',
        summary: 'A longer description or summary',
        reason: 'More compelling reason',
        request: 'More compelling request',
        references: null,
        addresseeId: 2,
        profile: 'User profile',
        email: 'updated@email.com',
      }

      const postUpdateStatus = await service.updatePost(postParams)

      const updatedPost = await db.Post.findByPk(POST_ID)

      expect(postUpdateStatus).toBeTruthy()
      expect(updatedPost).toMatchObject(postParams)
      expect(updatedPost?.get()).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('throws on bad addressee', async () => {
      const postParams = {
        id: POST_ID,
        title: 'Title should be even more concise',
        summary: 'A longer description or summary',
        reason: 'More compelling reason',
        request: 'More compelling request',
        references: null,
        addresseeId: -1,
        profile: 'User profile',
        email: 'updated@email.com',
      }

      const updateError = service.updatePost(postParams)

      await expect(updateError).rejects.toStrictEqual(
        new AddresseeDoesNotExistError(),
      )
      await expect(updateError).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('deletePost', () => {
    it('archives post successfully', async () => {
      await service.deletePost(POST_ID)
      const archivedPost = await db.Post.findByPk(POST_ID)

      expect(archivedPost?.status).toEqual(PostStatus.Closed)
      expect(archivedPost?.get()).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('throws an error on invalid id', async () => {
      const archiveError = service.deletePost(INVALID_POST_ID)

      await expect(archiveError).rejects.toStrictEqual(new PostUpdateError())
      await expect(archiveError).rejects.toThrowErrorMatchingSnapshot()
    })
  })

  describe('publishPost', () => {
    let closedPost: Post
    beforeEach(async () => {
      const mockClosedPost = {
        ...mockPost,
        status: PostStatus.Closed,
      }
      closedPost = await db.Post.create(mockClosedPost)
    })
    it('returns void on making post public', async () => {
      await service.publishPost(closedPost.id)
      const publishedPost = await db.Post.findByPk(closedPost.id)

      expect(publishedPost?.status).toEqual(PostStatus.Open)
      expect(publishedPost?.get()).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('throws an error on invalid id', async () => {
      const publishError = service.publishPost(INVALID_POST_ID)

      await expect(publishError).rejects.toStrictEqual(new PostUpdateError())
      await expect(publishError).rejects.toThrowErrorMatchingSnapshot()
    })
  })
})
