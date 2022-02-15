import { Message } from '.'
import { Post, Signature, Addressee } from '../base'

export type PostWithAddresseeAndSignatures = Post & {
  signatureCount: number
  signatures: Signature[]
  addressee: Pick<Addressee, 'name' | 'shortName'>
}

export type ListPostsDto = {
  posts: PostWithAddresseeAndSignatures[]
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

export type CreatePostResDto = { data: number }

export type UpdatePostReqDto = CreatePostReqDto

export type UpdatePostResDto = Message
