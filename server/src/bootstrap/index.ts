import compression from 'compression'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { checkOwnershipUsing } from '../middleware/checkOwnership'
import { SignatureController } from '../modules/signatures/signature.controller'
import { SignatureService } from '../modules/signatures/signature.service'
import { AuthController } from '../modules/auth/auth.controller'
import { AuthMiddleware } from '../modules/auth/auth.middleware'
import { AuthService } from '../modules/auth/auth.service'
import { PostController } from '../modules/post/post.controller'
import { PostService } from '../modules/post/post.service'
import { UserService } from '../modules/user/user.service'
import { api } from '../routes'
import { baseConfig, Environment } from './config/base'
import { emailValidator } from './email-validator'
import { helmetOptions } from './helmet-options'
import { requestLoggingMiddleware } from './logging/request-logging'
import { passportConfig } from './passport'
import { Signature, Post, sequelize, User } from './sequelize'
import sessionMiddleware from './session'

export { sequelize } from './sequelize'
export const app = express()

// compressing api response
app.use(compression())

// logger
app.use(requestLoggingMiddleware)

// cors enable
app.options('*', cors<express.Request>())
app.use(cors({ origin: `http://localhost:${process.env.SERVER_PORT}` }))

// security config
app.use(helmet(helmetOptions))

// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// passport and session
app.set('trust proxy', 1) // trust first proxy
app.use(sessionMiddleware(sequelize))
passportConfig(app, User)

// all the api routes
const authService = new AuthService({
  emailValidator,
  User,
  Post,
})
const authMiddleware = new AuthMiddleware()
const postService = new PostService({
  Signature,
  Post,
  User,
  sequelize,
})
const signatureService = new SignatureService({
  Post,
  Signature,
  sequelize,
})

const apiOptions = {
  signature: {
    controller: new SignatureController({
      signatureService,
      postService,
    }),
    authMiddleware,
    checkOwnership: checkOwnershipUsing({ Post, Signature, User }),
  },
  auth: {
    controller: new AuthController(),
    authMiddleware,
  },
  post: {
    controller: new PostController({
      authService,
      postService,
    }),
    authMiddleware,
  },
}

app.use('/api/v1', api(apiOptions))

// connection with client setup
if (baseConfig.nodeEnv === Environment.Prod) {
  const setNoCache = (res: express.Response) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    res.setHeader('Expires', date.toUTCString())
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Cache-Control', 'public, no-cache')
  }

  const setLongTermCache = (res: express.Response) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    res.setHeader('Expires', date.toUTCString())
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  }

  app.use(
    express.static(path.resolve(__dirname, '../../..', 'client', 'build'), {
      extensions: ['html'],
      setHeaders(res, path) {
        if (path.includes('static')) {
          setLongTermCache(res)
        } else {
          setNoCache(res)
        }
      },
    }),
  )

  const index = fs.readFileSync(
    path.resolve(__dirname, '../../..', 'client', 'build', 'index.html'),
  )

  // TODO: sync-up with front end
  // iterate through list of possible paths to serve index file
  const allStaticPaths = [
    '/',
    '/questions',
    '/login',
    '/add/question',
    '/edit/question/:id',
    '/terms',
    '/agency-terms',
    '/privacy',
    '/agency-privacy',
    '/user-login',
    '/unauthorised',
  ]
  for (const path of allStaticPaths) {
    app.get(path, (_req, res) =>
      res.header('content-type', 'text/html').send(index),
    )
  }

  app.get('/not-found', (_req, res) =>
    res
      .header('content-type', 'text/html')
      .status(StatusCodes.NOT_FOUND)
      .send(index),
  )

  app.get('*', (_req, res) =>
    res
      .header('content-type', 'text/html')
      .redirect(StatusCodes.MOVED_PERMANENTLY, '/not-found'),
  )
}

export default app
