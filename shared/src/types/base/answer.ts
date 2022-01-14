import { z } from 'zod'
import { BaseModel } from './common'

export const Signature = BaseModel.extend({
  comment: z.string().nullable(),
  userId: z.number().nonnegative(),
  postId: z.number().nonnegative(),
})

export type Signature = z.infer<typeof Signature>
