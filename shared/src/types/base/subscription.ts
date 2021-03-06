import { z } from 'zod'
import { BaseModel } from './common'

export const Subscription = BaseModel.extend({
  postId: z.string(),
  email: z.string(),
})

export type Subscription = z.infer<typeof Subscription>
