import { z } from 'zod'
import { BaseModel } from './common'

export const User = BaseModel.extend({
  sgid: z.string(),
  displayname: z.string(),
  fullname: z.string(),
  email: z.string(),
  active: z.boolean(),
})

export type User = z.infer<typeof User>
