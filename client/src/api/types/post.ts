import { BaseModelParams, MessageResponse } from './common'
import { User, PostStatus } from '~shared/types/base'

export type BasePostDto = BaseModelParams & {
  userId: number
  title: string
  summary: string
  reason: string | null
  request: string | null
  references: string | null
  status: PostStatus
}

// Backend does not select updatedAt
export type GetSinglePostDto = BasePostDto & {
  user: Pick<User, 'displayname'>
  relatedPosts: BasePostDto[]
}

export type GetPostsDto = {
  posts: BasePostDto[]
  totalItems: number
}

export type CreatePostReqDto = Pick<
  BasePostDto,
  'title' | 'summary' | 'reason' | 'request' | 'references'
>

export type CreatePostResDto = MessageResponse & { data: number }

export type UpdatePostReqDto = CreatePostReqDto

export type UpdatePostResDto = MessageResponse
