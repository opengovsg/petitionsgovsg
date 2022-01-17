import { validationResult } from 'express-validator'
import { SignatureService } from './signature.service'
import { AuthService } from '../auth/auth.service'
import { createLogger } from '../../bootstrap/logging'
import { StatusCodes } from 'http-status-codes'
import { ControllerHandler } from '../../types/response-handler'
import { Message } from '../../types/message-type'
import { Signature } from '~shared/types/base'

const logger = createLogger(module)

export class SignatureController {
  private signatureService: Public<SignatureService>

  constructor({
    signatureService,
  }: {
    signatureService: Public<SignatureService>
    authService: Pick<AuthService, 'hasPermissionToEditPost'>
  }) {
    this.signatureService = signatureService
  }

  /**
   * Lists all signature to a post
   * @param postId id of the post
   * @returns 200 with array of answers
   * @returns 500 if database error occurs
   */
  listSignatures: ControllerHandler<{ id: string }, Signature[] | Message> =
    async (req, res) => {
      try {
        const signatures = await this.signatureService.listSignatures(
          Number(req.params.id),
        )
        return res.status(StatusCodes.OK).json(signatures)
      } catch (error) {
        logger.error({
          message: 'Error while retrieving signatures for post',
          meta: {
            function: 'getSignatures',
            postId: req.params.id,
          },
          error,
        })
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Server Error' })
      }
    }

  /**
   * Create an answer attached to a post
   * @param postId id of post to attach to
   * @body text answer text
   * @returns 200 with new answer id
   * @returns 400 if invalid request
   * @returns 401 if user not signed in
   * @returns 403 if user is not authorized to answer question
   * @returns 500 if database error
   */
  createSignature: ControllerHandler<
    { id: string },
    number | Message,
    { text: string; fullname: string },
    undefined
  > = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: errors.array()[0].msg })
    }
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'User not signed in' })
    }

    try {
      // Save Signature in the database
      const data = await this.signatureService.createSignature({
        comment: req.body.text,
        userId: Number(req.user.id),
        postId: Number(req.params.id),
        fullname: req.body.fullname,
      })

      return res.status(StatusCodes.OK).json(data)
    } catch (error) {
      logger.error({
        message: 'Error while adding new answer',
        meta: {
          function: 'addAnswer',
          userId: req.user.id,
          postId: req.params.id,
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }
  }

  /**
   * Delete an signature. Currently not used as a post delete
   * will archive the post and will not touch the signature.
   * @param id of signature to delete
   * @returns 200 on successful delete
   * @returns 500 on database error
   */
  deleteSignature: ControllerHandler<{ id: string }, Message> = async (
    req,
    res,
  ) => {
    try {
      await this.signatureService.deleteSignature(Number(req.params.id))
      return res.status(StatusCodes.OK).end()
    } catch (error) {
      logger.error({
        message: 'Error while deleting signature',
        meta: {
          function: 'deleteSignature',
          signatureId: req.params.id,
        },
        error,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Server Error' })
    }
  }
}
