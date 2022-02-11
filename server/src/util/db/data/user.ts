import { UserAuthType } from '~shared/types/api'

export const mockUser = {
  id: 'sgid',
  fullname: 'John Doe',
  type: UserAuthType.Public,
}

export const mockOtherUser = {
  id: 'otherUser',
  fullname: 'Not John Doe',
  type: UserAuthType.Public,
}

export const mockAnonUser = {
  id: 'sgid',
  fullname: null,
  type: UserAuthType.Public,
}

export const mockUserJWT = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNnaWQiLCJmdWxsbmFtZSI6IkpvaG4gRG9lIiwidHlwZSI6InB1YmxpYyIsImlhdCI6MTY0NDIxMjcxNn0.SXDePYRMfpSEQaGX0YcloTkF_BvPSNiOkhcAoQ6W7NM',
}

export const mockOtherUserJWT = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im90aGVyVXNlciIsImZ1bGxuYW1lIjoiTm90IEpvaG4gRG9lIiwidHlwZSI6InB1YmxpYyIsImlhdCI6MTY0NDQ2Mzk2MX0.xFLcMyOeg1B9h66KGRLMvNglmg2TUCUF9q1Zqnd9bwE',
}

export const mockAnonUserJWT = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNnaWQiLCJ0eXBlIjoicHVibGljIiwiZnVsbG5hbWUiOm51bGwsImlhdCI6MTY0NDQ2NTIyM30.6yuMIvcfFt0bwGHupMOeG-9SJtyJl4oPj_LPadyFLaY',
}
