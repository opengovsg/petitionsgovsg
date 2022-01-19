import { BaseModelParams, MessageResponse } from './common'

export type BaseSignatureDto = BaseModelParams & {
  comment: string | null
  hashedUserSgid: number
  postId: number
  fullname: string | null
}

export type CreateSignatureReqDto = {
  comment: string | null
  useName: boolean
}

// Returns signature ID
export type CreateSignatureResDto = MessageResponse & { data: number }
