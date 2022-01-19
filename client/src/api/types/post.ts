import { BaseModelParams, MessageResponse } from './common'
import { PostStatus } from '~shared/types/base'
import { BaseSignatureDto } from './signature'

export type BasePostDto = BaseModelParams & {
  id: number
  hashedUserSgid: string
  title: string
  summary: string | null
  reason: string
  request: string
  references: string | null
  status: PostStatus
  fullname: string
  salt: string
  addresseeId: number
  profile: string | null
  email: string
}

// Backend does not select updatedAt
export type GetSinglePostDto = BasePostDto & {
  signatures: Pick<BaseSignatureDto, 'comment' | 'createdAt' | 'fullname'>[]
  signatureCount: number
}

export type GetPostsDto = {
  posts: GetSinglePostDto[]
  totalItems: number
}

export type CreatePostReqDto = Pick<
  BasePostDto,
  | 'title'
  | 'summary'
  | 'reason'
  | 'request'
  | 'references'
  | 'fullname'
  | 'addresseeId'
  | 'profile'
  | 'email'
>

export type CreatePostResDto = MessageResponse & { data: number }

export type UpdatePostReqDto = CreatePostReqDto

export type UpdatePostResDto = MessageResponse
