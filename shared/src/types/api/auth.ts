export enum UserAuthType {
  Public = 'public',
  Agency = 'agency', // For future implementation
}
export interface AuthUserDto {
  id: string
  type: UserAuthType
  fullname: string
}

export type LoadPublicUserDto = Pick<AuthUserDto, 'id'> | null

export type LoadUserNameDto = Pick<AuthUserDto, 'fullname'> | null
