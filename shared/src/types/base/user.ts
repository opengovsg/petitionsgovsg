import { z } from 'zod'
import { BaseModel } from './common'

export const User = BaseModel.extend({
  sgid: z.string(),
  displayname: z.string().nullable(),
  fullname: z.string(),
  email: z.string().nullable(),
  active: z.boolean(),
})

export type User = z.infer<typeof User>
