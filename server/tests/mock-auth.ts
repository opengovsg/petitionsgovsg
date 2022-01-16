import { Session } from 'supertest-session'

export const createAuthedSession = async (
  request: Session,
): Promise<Session> => {
  await request.get('/auth/mock')
  return request
}

export const logoutSession = async (request: Session): Promise<Session> => {
  const response = await request.post('/auth/logout')

  expect(response.status).toEqual(200)

  const sessionCookie = request.cookies.find(
    (cookie) => cookie.name === 'connect.sid',
  )
  expect(sessionCookie).not.toBeDefined()

  return request
}
