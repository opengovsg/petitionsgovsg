import { Addressee, Post, Signature } from '~shared/types/base'
import { MessageResponse } from './common'

// Backend does not select updatedAt
export type GetSinglePostDto = Post & {
  signatures: Pick<Signature, 'comment' | 'createdAt' | 'fullname'>[]
  signatureCount: number
  addressee: Pick<Addressee, 'name' | 'shortName'>
}

export type GetPostsDto = {
  posts: GetSinglePostDto[]
  totalItems: number
}

export type CreatePostReqDto = Pick<
  Post,
  | 'title'
  | 'summary'
  | 'reason'
  | 'request'
  | 'references'
  | 'addresseeId'
  | 'profile'
  | 'email'
>

export type CreatePostResDto = MessageResponse & { data: number }

export type UpdatePostReqDto = CreatePostReqDto

export type UpdatePostResDto = MessageResponse
