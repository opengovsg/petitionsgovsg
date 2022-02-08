import * as JWT from 'jsonwebtoken'
import { AuthUserDto } from '~shared/types/api'

const JWT_SECRET = process.env.JWT_SECRET ?? ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeUserJWT = (req: any): AuthUserDto => {
  return JWT.verify(req.cookies.jwt, JWT_SECRET) as AuthUserDto
}

export const encodeUserJWT = (claims: AuthUserDto): string => {
  // set expiry to 5 minutes
  return JWT.sign(claims, JWT_SECRET, { expiresIn: 5 * 60 })
}
