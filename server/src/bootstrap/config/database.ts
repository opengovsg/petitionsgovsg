import convict, { Schema } from 'convict'
import { url } from 'convict-format-with-validator'

convict.addFormat(url)

export type DbConfig = {
  host: string
  username: string
  password: string
  database: string
  dialect: 'postgres'
  port: number
}

const dbSchema: Schema<DbConfig> = {
  host: {
    doc: 'Host URL for database connection',
    format: 'url',
    default: null,
    env: 'DB_HOST',
    sensitive: true,
  },
  username: {
    doc: 'Username for database connection',
    format: String,
    default: null,
    env: 'DB_USER',
    sensitive: true,
  },
  password: {
    doc: 'Password for database connection',
    format: String,
    default: null,
    env: 'DB_PASSWORD',
    sensitive: true,
  },
  database: {
    doc: 'Database name',
    format: String,
    default: null,
    env: 'DB_NAME',
  },
  dialect: {
    doc: 'Database dialect',
    format: String,
    default: 'postgres',
  },
  port: {
    doc: 'Database port',
    format: Number,
    default: 5432,
    env: 'DB_PORT',
  },
}

export const dbConfig = convict(dbSchema)
  .validate({ allowed: 'strict' })
  .getProperties()
