import express from 'express'
import { AddresseeController } from '@/modules/addressee/addressee.controller'
import { routeAddressees } from '@/modules/addressee/addressee.routes'
import { AuthController } from '@/modules/auth/auth.controller'
import { AuthMiddleware } from '@/modules/auth/auth.middleware'
import { routeAuth } from '@/modules/auth/auth.routes'
import { EnvController } from '@/modules/environment/env.controller'
import { routeEnv } from '@/modules/environment/env.routes'
import { PostController } from '@/modules/post/post.controller'
import { routePosts } from '@/modules/post/post.routes'
import { SignatureController } from '@/modules/signatures/signature.controller'
import { routeSignatures } from '@/modules/signatures/signature.routes'
import { SubscriptionController } from '@/modules/subscription/subscription.controller'
import { routeSubscriptions } from '@/modules/subscription/subscription.routes'

type ApiRouterOptions = {
  signature: {
    controller: SignatureController
    authMiddleware: AuthMiddleware
  }
  env: EnvController
  auth: {
    controller: AuthController
    authMiddleware: AuthMiddleware
  }
  post: {
    controller: PostController
    authMiddleware: AuthMiddleware
  }
  addressee: {
    controller: AddresseeController
  }
  subscription: {
    controller: SubscriptionController
    authMiddleware: AuthMiddleware
  }
}

export const api = (options: ApiRouterOptions): express.Router => {
  const router = express.Router()

  router.use('/auth', routeAuth(options.auth))
  router.use('/posts', routePosts(options.post))
  router.use('/environment', routeEnv({ controller: options.env }))
  router.use('/posts/signatures', routeSignatures(options.signature))
  router.use('/addressees', routeAddressees(options.addressee))
  router.use('/subscriptions', routeSubscriptions(options.subscription))

  return router
}
