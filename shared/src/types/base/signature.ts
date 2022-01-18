import { z } from 'zod'
import { BaseModel } from './common'

export const Signature = BaseModel.extend({
  comment: z.string().nullable(),
  hashedUserSgid: z.string(),
  postId: z.number().nonnegative(),
  fullname: z.string().nullable(),
})

export type Signature = z.infer<typeof Signature>
