import { StatusCodes } from 'http-status-codes'
import { ApplicationError } from '../core/core.errors'

export class MissingPublicPostError extends ApplicationError {
  constructor(
    message = 'No public post with this id',
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, statusCode)
  }
}

export class PostUpdateError extends ApplicationError {
  constructor(
    message = 'Post update failed',
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode)
  }
}
