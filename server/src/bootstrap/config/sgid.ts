import convict, { Schema } from 'convict'
import { url } from 'convict-format-with-validator'

convict.addFormat(url)

type SgidConfig = {
  endpoint: string
  clientId: string
  clientSecret: string
  redirectUri: string
  privateKey: string
}

convict.addFormat({
  name: 'Key',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validate: (val) => {
    const regex = new RegExp(
      '-----BEGIN PRIVATE KEY-----([^-!]+)-----END PRIVATE KEY-----',
    )
    if (!regex.test(val)) {
      throw new Error('Malformed Private Key')
    }
  },
  coerce: (val) => val.replace(/\\n/g, '\n'),
})

const sgidSchema: Schema<SgidConfig> = {
  endpoint: {
    doc: 'The SGID login endpoint',
    format: String,
    default: '',
    env: 'SGID_ENDPOINT',
  },
  clientId: {
    doc: 'The SGID client id',
    format: String,
    default: 'petitionsgov',
    env: 'SGID_CLIENT_ID',
  },
  clientSecret: {
    doc: 'The SGID client secret',
    format: String,
    default: '',
    env: 'SGID_CLIENT_SECRET',
  },
  redirectUri: {
    doc: 'The uri to redirect to for callback',
    format: String,
    default: '',
    env: 'SGID_REDIRECT_URI',
  },
  privateKey: {
    doc: 'The SGID client id',
    format: 'Key',
    default: 'petitionsgov',
    env: 'SGID_PRIV_KEY',
  },
}

export const sgidConfig = convict(sgidSchema)
  .validate({ allowed: 'strict' })
  .getProperties()
