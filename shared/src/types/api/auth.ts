export enum UserAuthType {
  Public = 'public',
  Agency = 'agency', // For future implementation
}
export interface AuthUserDto {
  id: string
  type: UserAuthType
  fullname: string | null
}

export type LoadPublicUserDto = Pick<AuthUserDto, 'id' | 'fullname'> | null

export type LoadUserNameDto = Pick<AuthUserDto, 'fullname'> | null
