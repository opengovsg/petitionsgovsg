import { mockPost } from '@/util/db/data/post'
import { PostStatus } from '~shared/types/base'
import { AuthService } from '../auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeAll(async () => {
    service = new AuthService()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  describe('verifyUserCanViewPost', () => {
    it('returns on public post', async () => {
      const post = { ...mockPost, status: PostStatus.Open }
      const userId = undefined

      const functionToTest = () => service.verifyUserCanViewPost(post, userId)

      expect(functionToTest).not.toThrowError()
    })

    it('returns on draft post', async () => {
      // draft posts are posts awaiting endorsement, these can be viewed by anyone with link
      const post = { ...mockPost, status: PostStatus.Draft }
      const userId = undefined

      const functionToTest = () => service.verifyUserCanViewPost(post, userId)

      expect(functionToTest).not.toThrowError()
    })

    it('throws on archived post without userId', async () => {
      // draft posts are posts awaiting endorsement, these can be viewed by anyone with link
      const post = { ...mockPost, status: PostStatus.Closed }
      const userId = undefined

      const functionToTest = () => service.verifyUserCanViewPost(post, userId)

      expect(functionToTest).toThrowErrorMatchingSnapshot()
    })
  })

  describe('verifyPetitionOwner', () => {
    it('returns true on user is petition owner', async () => {
      const userId = mockPost.hashedUserSgid

      const response = service.verifyPetitionOwner(mockPost, userId)

      expect(response).toEqual(true)
    })

    it('returns false on user is not petition owner', async () => {
      const userId = 'invalidHashedUserSgid'

      const response = service.verifyPetitionOwner(mockPost, userId)

      expect(response).toEqual(false)
    })

    it('returns false if no user id is found', async () => {
      const userId = undefined

      const response = service.verifyPetitionOwner(mockPost, userId)

      expect(response).toEqual(false)
    })
  })
})
