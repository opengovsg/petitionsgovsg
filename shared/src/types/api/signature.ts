export type CreateSignatureReqDto = {
  comment: string | null
  useName: boolean
  type?: string
}

// Returns signature ID
export type CreateSignatureResDto = number
