import { Post } from '~shared/types/base'

export type PostEditType = {
  id: number
  userid: number
  summary: string
  title: string
}

export type UpdatePostRequestDto = Pick<Post, 'title' | 'summary'>
