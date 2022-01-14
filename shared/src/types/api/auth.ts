import { User } from '../base'

export enum UserAuthType {
  Public = 'public',
  Agency = 'agency', // For future implementation
}

export type LoadPublicUserDto = User | null
export interface AuthUserDto {
  id: number
  type: UserAuthType
}
