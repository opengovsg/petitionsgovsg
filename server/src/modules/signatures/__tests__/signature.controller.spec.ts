import supertest from 'supertest'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTestDatabase,
  resetAndSetupDb,
  SequelizeWithModels,
} from '../../../util/db/jest-db'
import { SignatureController } from '../signature.controller'
import { POST_ID } from '../../../util/db/constants'
import { mockSignatures, mockSignature } from '../../../util/db/data/signature'
import { ControllerHandler } from '../../../types/response-handler'
import { mockUser, mockUserJWT } from '../../../util/db/data/user'
import { Model } from 'sequelize'
import { Post } from '~shared/types/base/post'
import { Creation } from '../../../types/sequelize'
import { errAsync } from 'neverthrow'
import { DatabaseError } from '@/modules/core/core.errors'

describe('SignatureController', () => {
  let db: SequelizeWithModels
  let post: Model<Post, Creation<Post>> | null

  // Set up auth middleware to inject user
  let authUser: Express.User | undefined
  let jwt: { jwt: string } | undefined
  const middleware: ControllerHandler = (req, _res, next) => {
    req.user = authUser
    req['cookies'] = jwt
    next()
  }

  // Set up express-validator middleware
  const noErrors: { errors: () => { msg: string }[] }[] = []
  let errors: { errors: () => { msg: string }[] }[] = noErrors
  const invalidateIfHasErrors: ControllerHandler = (req, _res, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req['express-validator#contexts'] = errors
    next()
  }

  // Mock external service(s)
  const postService = {
    listPosts: jest.fn(),
    getSinglePost: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
    updatePost: jest.fn(),
    publishPost: jest.fn(),
  }

  const signatureService = {
    listSignatures: jest.fn(),
    createSignature: jest.fn(),
    checkUserHasSigned: jest.fn(),
  }

  const signatureController = new SignatureController({
    signatureService,
    postService,
  })

  const postPath = `/${POST_ID}`
  const checkPath = `/check/${POST_ID}`

  beforeAll(async () => {
    db = await createTestDatabase()
  })

  beforeEach(async () => {
    await resetAndSetupDb(db)
    jest.resetAllMocks()
  })

  describe('listSignatures', () => {
    const app = express()
    app.get('/:id', signatureController.listSignatures)
    const request = supertest(app)
    it('retrieves all signatures to a post with /:id', async () => {
      signatureService.listSignatures.mockResolvedValueOnce(mockSignatures)

      const response = await request.get(postPath)

      expect(signatureService.listSignatures).toHaveBeenCalledWith(POST_ID)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSignatures)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      signatureService.listSignatures.mockRejectedValue(
        errAsync(new DatabaseError()),
      )

      const response = await request.get(postPath)

      expect(signatureService.listSignatures).toHaveBeenCalledWith(POST_ID)
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('createSignature', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/:id', signatureController.createSignature)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      errors = noErrors
      post = await db.Post.findByPk(POST_ID)
      signatureService.createSignature.mockResolvedValue(mockSignature.id)
    })

    it('returns BAD_REQUEST on invalidated request', async () => {
      errors = [
        {
          errors: () => [
            {
              msg: 'Validation Error',
            },
          ],
        },
      ]

      const response = await request
        .post(postPath)
        .send({ comment: mockSignature.comment })

      expect(signatureService.createSignature).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request
        .post(postPath)
        .send({ useName: true, comment: mockSignature.comment })

      expect(signatureService.createSignature).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns BAD_REQUEST on user has alaready signed', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      signatureService.checkUserHasSigned.mockResolvedValueOnce(mockSignature)
      const response = await request
        .post(postPath)
        .send({ comment: mockSignature.comment })

      expect(signatureService.createSignature).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body).toStrictEqual({
        message: 'User has already signed this petition',
      })
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission with useName set to true', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      const signatureAttributes = {
        comment: mockSignature.comment,
        hashedUserSgid: mockSignature.hashedUserSgid,
        postId: mockSignature.postId,
        fullname: authUser?.fullname,
      }

      const response = await request
        .post(postPath)
        .send({ useName: true, comment: mockSignature.comment })

      expect(signatureService.createSignature).toHaveBeenCalledWith(
        signatureAttributes,
      )
      expect(postService.publishPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSignature.id)
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission with useName set to false', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      const signatureAttributes = {
        comment: mockSignature.comment,
        hashedUserSgid: mockSignature.hashedUserSgid,
        postId: mockSignature.postId,
        fullname: null,
      }

      const response = await request
        .post(postPath)
        .send({ useName: false, comment: mockSignature.comment })

      expect(signatureService.createSignature).toHaveBeenCalledWith(
        signatureAttributes,
      )
      expect(postService.publishPost).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSignature.id)
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK on valid submission with post published when signature count hits threshold', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: mockSignatures,
      })
      const signatureAttributes = {
        comment: mockSignature.comment,
        hashedUserSgid: mockSignature.hashedUserSgid,
        postId: mockSignature.postId,
        fullname: authUser?.fullname,
      }

      const response = await request
        .post(postPath)
        .send({ useName: true, comment: mockSignature.comment })

      expect(signatureService.createSignature).toHaveBeenCalledWith(
        signatureAttributes,
      )
      expect(postService.publishPost).toHaveBeenCalledWith(POST_ID)
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSignature.id)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      signatureService.createSignature.mockRejectedValue(
        errAsync(new DatabaseError()),
      )
      const signatureAttributes = {
        comment: mockSignature.comment,
        hashedUserSgid: mockSignature.hashedUserSgid,
        postId: mockSignature.postId,
        fullname: authUser?.fullname,
      }

      const response = await request
        .post(postPath)
        .send({ useName: true, comment: mockSignature.comment })

      expect(signatureService.createSignature).toHaveBeenCalledWith(
        signatureAttributes,
      )
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('checkUserHasSigned', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.get('/check/:id', signatureController.checkUserHasSigned)
    const request = supertest(app)

    beforeEach(async () => {
      authUser = mockUser
      jwt = mockUserJWT
      post = await db.Post.findByPk(POST_ID)
    })

    it('returns OK with user signature on user has signed', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      signatureService.checkUserHasSigned.mockResolvedValueOnce(mockSignature)

      const response = await request.get(checkPath)

      expect(signatureService.checkUserHasSigned).toHaveBeenCalledWith(
        POST_ID,
        mockSignature.hashedUserSgid,
      )
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(mockSignature)
      expect(response.body).toMatchSnapshot()
    })

    it('returns OK with null body on user has not signed', async () => {
      postService.getSinglePost.mockResolvedValueOnce({
        ...post?.get(),
        signatures: [],
      })
      signatureService.checkUserHasSigned.mockResolvedValueOnce(null)

      const response = await request.get(checkPath)

      expect(signatureService.checkUserHasSigned).toHaveBeenCalledWith(
        POST_ID,
        mockSignature.hashedUserSgid,
      )
      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(null)
      expect(response.body).toMatchSnapshot()
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      postService.getSinglePost.mockRejectedValue(errAsync(new DatabaseError()))

      const response = await request.get(checkPath)

      expect(signatureService.checkUserHasSigned).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(response.body).toMatchSnapshot()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      authUser = undefined
      jwt = undefined

      const response = await request.get(checkPath)

      expect(signatureService.checkUserHasSigned).not.toHaveBeenCalled()
      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
      expect(response.body).toMatchSnapshot()
    })
  })
})
