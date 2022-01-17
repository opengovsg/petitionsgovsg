import { BaseModelParams, MessageResponse } from './common'

export type BaseSignatureDto = BaseModelParams & {
  comment: string
  userId: number
  postId: number
}

export type GetSignaturesForPostDto = (BaseSignatureDto & {
  userId: number
  displayname: string
  fullname: string
})[]

export type CreateSignatureReqDto = { text: string }

// Returns signature ID
export type CreateSignatureResDto = MessageResponse & { data: number }
