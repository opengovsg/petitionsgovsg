import { z } from 'zod'
import { BaseModel } from './common'

export const Addressee = BaseModel.extend({
  name: z.string(),
  shortName: z.string().nullable(),
  openToPublic: z.boolean(),
  officerEmails: z.array(z.string()).nullable(),
})

export type Addressee = z.infer<typeof Addressee>
