import { Addressee } from '~shared/types/base'
import { MessageResponse } from './common'

export type CreateAddresseeReqDto = Pick<Addressee, 'name' | 'shortName'>

// Returns signature ID
export type CreateAddresseeResDto = MessageResponse & { data: number }
