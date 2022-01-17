import { BaseModelParams, MessageResponse } from './common'
import { PostStatus } from '~shared/types/base'
import { BaseSignatureDto } from './signature'

export type BasePostDto = BaseModelParams & {
  userId: number
  title: string
  summary: string
  reason: string | null
  request: string | null
  references: string | null
  status: PostStatus
  fullname: string
}

// Backend does not select updatedAt
export type GetSinglePostDto = BasePostDto & {
  signatures: Pick<BaseSignatureDto, 'comment' | 'createdAt' | 'fullname'>[]
  signatureCount: number
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
