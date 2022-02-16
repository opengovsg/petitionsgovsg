import { StatusCodes } from 'http-status-codes'
import { ApplicationError } from '@/modules/core/core.errors'

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

export class AddresseeDoesNotExistError extends ApplicationError {
  constructor(
    message = 'Addressee does not exist',
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode)
  }
}

export class UserCannotViewPostError extends ApplicationError {
  constructor(
    message = 'User must be logged in to access private post',
    statusCode = StatusCodes.FORBIDDEN,
  ) {
    super(message, statusCode)
  }
}
