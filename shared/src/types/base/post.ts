import { z } from 'zod'
import { BaseModel } from './common'

export enum PostStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Draft = 'DRAFT',
}

export const Post = BaseModel.extend({
  title: z.string(),
  summary: z.string(),
  reason: z.string().nullable(),
  request: z.string().nullable(),
  userId: z.number().nonnegative(),
  references: z.string().nullable(),
  status: z.nativeEnum(PostStatus),
})

export type Post = z.infer<typeof Post>
