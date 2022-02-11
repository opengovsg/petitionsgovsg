import { AuthUserDto } from '~shared/types/api'

export type BaseUserNameDto = Pick<AuthUserDto, 'fullname'>
