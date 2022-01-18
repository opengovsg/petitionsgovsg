import { z } from 'zod'
import { BaseModel } from './common'

export enum PostStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Draft = 'DRAFT',
}

export const Post = BaseModel.extend({
  title: z.string(),
  summary: z.string().nullable(),
  reason: z.string(),
  request: z.string(),
  userId: z.string(),
  references: z.string().nullable(),
  status: z.nativeEnum(PostStatus),
  fullname: z.string(),
  salt: z.string(),
})

export type Post = z.infer<typeof Post>
