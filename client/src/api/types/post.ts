import { MessageData } from '~shared/types/api'
import { Addressee, Post, Signature } from '~shared/types/base'

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

export type CreatePostResDto = MessageData<number>

export type UpdatePostReqDto = CreatePostReqDto

export type UpdatePostResDto = MessageData
