import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { CreateSubscriptionReqDto, ErrorDto } from '~shared/types/api'
import { createLogger } from '@/bootstrap/logging'
import { ControllerHandler } from '@/types/response-handler'
import { SubscriptionService } from './subscription.service'

const logger = createLogger(module)

export class SubscriptionController {
  private subscriptionService: Public<SubscriptionService>

  constructor({
    subscriptionService,
  }: {
    subscriptionService: Public<SubscriptionService>
  }) {
    this.subscriptionService = subscriptionService
  }

  /**
   * Create a subscription attached to a post
   * @param postId id of post to attach to
   * @body email
   * @returns 200 with new subscription id
   * @returns 400 if invalid request
   * @returns 401 if user not signed in
   * @returns 403 if user is not authorized to answer question
   * @returns 500 if database error
   */
  createSubscription: ControllerHandler<
    { id: string },
    number | ErrorDto,
    CreateSubscriptionReqDto,
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
      // Save Subscription in the database
      const subscriptionId = await this.subscriptionService.createSubscription({
        email: req.body.email,
        postId: Number(req.params.id),
      })
      return res.status(StatusCodes.OK).json(subscriptionId)
    } catch (error) {
      logger.error({
        message: 'Error while adding new subscription',
        meta: {
          function: 'createSubscription',
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
}
