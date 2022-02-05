import { validationResult } from 'express-validator'
import { SignatureService } from './signature.service'
import { createLogger } from '../../bootstrap/logging'
import { StatusCodes } from 'http-status-codes'
import { ControllerHandler } from '../../types/response-handler'
import { Message } from '../../types/message-type'
import { Signature } from '~shared/types/base'
import { PostService } from '../post/post.service'
import { hashData } from '../../util/hash'

const logger = createLogger(module)

const MIN_ENDORSER_COUNT = 2

export class SignatureController {
  private signatureService: Public<SignatureService>
  private postService: Public<PostService>

  constructor({
    signatureService,
    postService,
  }: {
    signatureService: Public<SignatureService>
    postService: Public<PostService>
  }) {
    this.signatureService = signatureService
    this.postService = postService
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
   * @body useName boolean field
   * @body fullname string field
   * @returns 200 with new signature id
   * @returns 400 if invalid request
   * @returns 401 if user not signed in
   * @returns 403 if user is not authorized to answer question
   * @returns 500 if database error
   */
  createSignature: ControllerHandler<
    { id: string },
    number | Message,
    { useName: boolean; comment: string | null },
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

    const post = await this.postService.getSinglePost(Number(req.params.id))
    const hashedUserSgid = await hashData(req.user.id, post.salt)
    const signed = await this.signatureService.checkUserHasSigned(
      Number(req.params.id),
      hashedUserSgid,
    )
    if (signed) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User has already signed this petition' })
    }

    try {
      // Save Signature in the database
      let name: string | null = null
      if (req.body.useName) {
        name = req.user.fullname
      }

      const signatureId = await this.signatureService.createSignature({
        comment: req.body.comment,
        hashedUserSgid,
        postId: Number(req.params.id),
        fullname: name,
      })
      // Publish post publicly when signature count hits threshold
      if (post.signatures.length >= MIN_ENDORSER_COUNT) {
        await this.postService.publishPost(Number(req.params.id))
      }

      return res.status(StatusCodes.OK).json(signatureId)
    } catch (error) {
      logger.error({
        message: 'Error while adding new signature',
        meta: {
          function: 'addSignature',
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

  checkUserHasSigned: ControllerHandler<
    { id: string },
    Signature | Message | null
  > = async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'User not signed in' })
      }

      const post = await this.postService.getSinglePost(Number(req.params.id))
      const hashedUserSgid = await hashData(req.user.id, post.salt)
      const hasUserSigned = await this.signatureService.checkUserHasSigned(
        Number(req.params.id),
        hashedUserSgid,
      )
      return res.status(StatusCodes.OK).json(hasUserSigned)
    } catch (error) {
      logger.error({
        message: 'Error while checking if user has signature',
        meta: {
          function: 'checkUserHasSigned',
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
