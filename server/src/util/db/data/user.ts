import { UserAuthType } from '~shared/types/api'

export const mockUser = {
  id: 'sgid',
  fullname: 'John Doe',
  type: UserAuthType.Public,
}

export const mockUserJWT = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNnaWQiLCJmdWxsbmFtZSI6IkpvaG4gRG9lIiwidHlwZSI6InB1YmxpYyIsImlhdCI6MTY0NDIxMjcxNn0.SXDePYRMfpSEQaGX0YcloTkF_BvPSNiOkhcAoQ6W7NM',
}
