import { MessageResponse } from './common'

export type CreateSignatureReqDto = {
  comment: string | null
  useName: boolean
}

// Returns signature ID
export type CreateSignatureResDto = MessageResponse & { data: number }
