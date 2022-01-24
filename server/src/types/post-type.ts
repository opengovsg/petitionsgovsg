import { Post } from '~shared/types/base'

export type PostEditType = {
  id: number
  title: string
  summary: string | null
  reason: string
  request: string
  references: string | null
  addresseeId: number
  profile: string | null
  email: string
}

export type UpdatePostRequestDto = Pick<
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
