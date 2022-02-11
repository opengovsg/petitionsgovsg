import convict, { Schema } from 'convict'
import { baseConfig, Environment } from './base'

export type AuthConfig = {
  jwtSecret: string
  sessionSecret: string
  govEmailGlob: string
}

const authSchema: Schema<AuthConfig> = {
  sessionSecret: {
    doc: 'Session secret',
    format: String,
    default: '',
    env: 'SESSION_SECRET',
    sensitive: true,
  },
  jwtSecret: {
    doc: 'JWT secret',
    format: String,
    default: 'myJwtSecret',
    env: 'JWT_SECRET',
    sensitive: true,
  },
  govEmailGlob: {
    doc: 'Glob to validate email addresses of government officers',
    format: String,
    default: '*.gov.sg',
    env: 'GOV_EMAIL_GLOB',
  },
}

export const authConfig = convict(authSchema)
  .validate({ allowed: 'strict' })
  .getProperties()

export const formCallbackRedirectURL = (state: string | undefined) =>
  baseConfig.nodeEnv === Environment.Dev
    ? `http://localhost:3000${state}`
    : `https://petitions.hack.gov.sg${state}`

export const callbackRedirectUnauthorisedURL =
  baseConfig.nodeEnv === Environment.Dev
    ? 'http://localhost:3000/unauthorised'
    : 'https://petitions.hack.gov.sg/unauthorised'
