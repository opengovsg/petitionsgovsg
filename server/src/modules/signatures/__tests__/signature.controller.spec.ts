import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { ControllerHandler } from '../../../types/response-handler'
import supertest from 'supertest'
import { SignatureController } from '../signature.controller'
import { UserAuthType } from '~shared/types/api'

describe('SignatureController', () => {
  const signatureService = {
    listSignatures: jest.fn(),
    createSignature: jest.fn(),
    deleteSignature: jest.fn(),
  }
  const authService = {
    hasPermissionToEditPost: jest.fn(),
  }

  const signatureController = new SignatureController({
    signatureService,
    authService,
  })

  // Set up auth middleware to inject user
  const goodUser = { id: 1, type: UserAuthType.Public }
  let user: Express.User | undefined = goodUser
  const middleware: ControllerHandler = (req, _res, next) => {
    req.user = user
    next()
  }

  const noErrors: { errors: () => { msg: string }[] }[] = []
  let errors: { errors: () => { msg: string }[] }[] = noErrors
  const invalidateIfHasErrors: ControllerHandler = (req, _res, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req['express-validator#contexts'] = errors
    next()
  }

  const postId = 1
  const postPath = `/${postId}`

  const answer = { id: 4, userId: user.id, postId, comment: 'Signature Body' }
  const answerPath = `/${answer.id}`

  beforeEach(() => {
    user = goodUser
    jest.resetAllMocks()
  })

  describe('listSignatures', () => {
    const app = express()
    app.get('/:id', signatureController.listSignatures)

    const request = supertest(app)

    it('returns OK on valid query', async () => {
      const signatures = [answer]
      signatureService.listSignatures.mockResolvedValueOnce(signatures)
      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(signatures)
      expect(signatureService.listSignatures).toHaveBeenCalledWith(postId)
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      signatureService.listSignatures.mockRejectedValue(new Error())

      const response = await request.get(postPath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(signatureService.listSignatures).toHaveBeenCalledWith(postId)
    })
  })

  describe('createSignature', () => {
    const app = express()
    app.use(express.json())
    app.use(middleware)
    app.use(invalidateIfHasErrors)
    app.post('/:id', signatureController.createSignature)
    const request = supertest(app)

    beforeEach(() => {
      user = goodUser
      errors = noErrors
      authService.hasPermissionToEditPost.mockResolvedValue(true)
      signatureService.createSignature.mockResolvedValue(answer.id)
    })

    it('returns BAD_REQUEST on bad request', async () => {
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
        .send({ text: answer.comment })

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
      expect(signatureService.createSignature).not.toHaveBeenCalled()
    })

    it('returns UNAUTHORIZED on no user', async () => {
      user = undefined

      const response = await request
        .post(postPath)
        .send({ text: answer.comment })

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED)
      expect(response.body).toStrictEqual({ message: 'User not signed in' })
      expect(signatureService.createSignature).not.toHaveBeenCalled()
    })

    it('returns OK on valid submission', async () => {
      const response = await request
        .post(postPath)
        .send({ text: answer.comment })

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toStrictEqual(answer.id)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...answerAttributes } = answer
      expect(signatureService.createSignature).toHaveBeenCalledWith(
        answerAttributes,
      )
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      signatureService.createSignature.mockRejectedValue(new Error())

      const response = await request
        .post(postPath)
        .send({ text: answer.comment })

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...answerAttributes } = answer
      expect(signatureService.createSignature).toHaveBeenCalledWith(
        answerAttributes,
      )
    })
  })

  describe('deleteSignature', () => {
    const app = express()
    app.delete('/:id', signatureController.deleteSignature)
    const request = supertest(app)

    it('returns OK on valid query', async () => {
      const response = await request.delete(answerPath)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(signatureService.deleteSignature).toHaveBeenCalledWith(answer.id)
    })

    it('returns INTERNAL_SERVER_ERROR on bad service', async () => {
      signatureService.deleteSignature.mockRejectedValue(new Error())

      const response = await request.delete(answerPath)

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toStrictEqual({ message: 'Server Error' })
      expect(signatureService.deleteSignature).toHaveBeenCalledWith(answer.id)
    })
  })
})
