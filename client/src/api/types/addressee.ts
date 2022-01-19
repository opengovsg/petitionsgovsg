import { BaseModelParams, MessageResponse } from './common'

export type BaseAddresseeDto = BaseModelParams & {
  name: string
  shortName: string | null
}

export type CreateAddresseeReqDto = {
  name: string
  shortName: string | null
}

// Returns signature ID
export type CreateAddresseeResDto = MessageResponse & { data: number }
