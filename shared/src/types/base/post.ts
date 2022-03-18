import { z } from 'zod'
import { HasSequelizeTimestamps } from './common'

export enum PostStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Draft = 'DRAFT',
}

export const Post = HasSequelizeTimestamps.extend({
  id: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  reason: z.string(),
  request: z.string(),
  hashedUserSgid: z.string(),
  references: z.string().nullable(),
  status: z.nativeEnum(PostStatus),
  fullname: z.string(),
  salt: z.string(),
  addresseeId: z.number(),
  profile: z.string().nullable(),
  email: z.string(),
  signatureOptions: z.array(z.string()),
  auditTrail: z.any(),
})

export type Post = z.infer<typeof Post>

export enum SortType {
  Newest = 'newest',
  Oldest = 'oldest',
  MostSignatures = 'most signatures',
  LeastSignatures = 'least signatures',
}
