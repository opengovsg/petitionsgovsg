import express from 'express'
import { OwnershipCheck } from '../middleware/checkOwnership'
import { SignatureController } from '../modules/signatures/signature.controller'
import { routeSignatures } from '../modules/signatures/signature.routes'
import { AuthController } from '../modules/auth/auth.controller'
import { AuthMiddleware } from '../modules/auth/auth.middleware'
import { routeAuth } from '../modules/auth/auth.routes'
import { PostController } from '../modules/post/post.controller'
import { routePosts } from '../modules/post/post.routes'

type ApiRouterOptions = {
  signature: {
    controller: SignatureController
    authMiddleware: AuthMiddleware
    checkOwnership: OwnershipCheck
  }
  auth: {
    controller: AuthController
    authMiddleware: AuthMiddleware
  }
  post: {
    controller: PostController
    authMiddleware: AuthMiddleware
  }
}

export const api = (options: ApiRouterOptions): express.Router => {
  const router = express.Router()

  router.use('/auth', routeAuth(options.auth))
  router.use('/posts', routePosts(options.post))
  router.use('/posts/signatures', routeSignatures(options.signature))

  return router
}
