import { User } from '../base'

export enum UserAuthType {
  Public = 'public',
  Agency = 'agency', // For future implementation
}

export type LoadPublicUserDto = Pick<User, 'id'> | null
export interface AuthUserDto {
  id: number
  type: UserAuthType
}
