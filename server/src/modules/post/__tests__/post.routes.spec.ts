import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Sequelize, ModelCtor } from 'sequelize'
import supertest from 'supertest'
import { Post, PostStatus } from '~shared/types/base'
import { UserAuthType } from '~shared/types/api'
import { Signature as SignatureModel, User as UserModel } from '../../../models'
import { ControllerHandler } from '../../../types/response-handler'
import { ModelDef } from '../../../types/sequelize'
import {
  createTestDatabase,
  getModel,
  getModelDef,
  ModelName,
} from '../../../util/jest-db'
import { UserService } from '../../user/user.service'
import { PostController } from '../post.controller'
import { routePosts } from '../post.routes'
import { PostService } from '../post.service'

describe('/posts', () => {
  let db: Sequelize
  let Signature: ModelCtor<SignatureModel>
  let Post: ModelDef<Post>
  let User: ModelCtor<UserModel>

  let userService: UserService
  let postService: PostService
  let controller: PostController

  const mockPosts: Post[] = []
  let mockUser: UserModel

  // Set up service, controller and route
  const authService = {
    hasPermissionToEditPost: jest.fn(),
    verifyUserCanViewPost: jest.fn(),
  }

  const authenticate: ControllerHandler = (req, res, next) => {
    req.user = { id: mockUser.id, type: UserAuthType.Public }
    next()
  }

  const authMiddleware = {
    authenticate,
  }

  beforeAll(async () => {
    db = await createTestDatabase()
    Signature = getModel<SignatureModel>(db, ModelName.Signature)
    Post = getModelDef<Post>(db, ModelName.Post)
    User = getModel<UserModel>(db, ModelName.User)
    userService = new UserService({ User })
    postService = new PostService({
      Signature,
      Post,
      User,
      sequelize: db,
    })
    mockUser = await User.create({
      sgid: 'u=34',
      email: 'tanahwee@test.gov.sg',
      fullname: 'Tan Ah Wee',
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
    controller = new PostController({ userService, authService, postService })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('GET /posts', () => {
    it('returns 200 and data on posts on request', async () => {
      const path = '/posts'
      const app = express()
      app.use(express.json())
      app.use(authenticate)
      app.use(path, routePosts({ controller, authMiddleware }))
      const request = supertest(app)

      // Act
      const response = await request.get(path)

      // Assert
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body.posts.length).toStrictEqual(mockPosts.length)
      expect(response.body.totalItems).toStrictEqual(mockPosts.length)
    })
  })

  describe('POST /posts', () => {
    it('returns 200 and creates a post on request', async () => {
      const path = '/posts'
      const app = express()
      app.use(express.json())
      app.use(authenticate)
      app.use(path, routePosts({ controller, authMiddleware }))
      const request = supertest(app)

      const body = {
        title: 'A title of at least 15 characters',
        summary:
          'A summary of at least 50 characters is the minimum requirement.',
        fullname: 'Lim Yong Xiang',
      }

      // Act
      const {
        status,
        body: { data: postId },
      } = await request.post(path).send(body)
      const post = await Post.findByPk(postId)

      // Assert
      expect(status).toEqual(StatusCodes.OK)
      expect(post).toBeDefined()
    })

    it('returns 403 if the title and description do not fulfil the character requirements', async () => {
      const path = '/posts'
      const app = express()
      app.use(express.json())
      app.use(authenticate)
      app.use(path, routePosts({ controller, authMiddleware }))
      const request = supertest(app)

      const body = {
        title: 'badTitle',
        summary: 'badSummary',
      }

      const response = await request.post(path).send(body)

      // Assert
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
    })
  })

  describe('DELETE /posts/:id', () => {
    it('returns 200 if post is deleted', async () => {
      const { id } = mockPosts[0]
      authService.hasPermissionToEditPost.mockResolvedValue(true)

      const path = '/posts'
      const app = express()
      app.use(express.json())
      app.use(authenticate)
      app.use(path, routePosts({ controller, authMiddleware }))
      const request = supertest(app)

      const response = await request.delete(path + `/${id}`)

      expect(response.status).toEqual(StatusCodes.OK)
    })
  })
})
