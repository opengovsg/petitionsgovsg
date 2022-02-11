import { Post, PostStatus } from '~shared/types/base'
import { UserCannotViewPostError } from '../post/post.errors'

export class AuthService {
  /**
   * Check if a user is able to view the post
   * @param post post to be viewed
   * @param userId id of user
   * @returns true if user can view post
   */
  verifyUserCanViewPost = (post: Post, userId?: string): void => {
    // If post is public, anyone can view
    // If private or archived, must be logged in
    if (
      post.status === PostStatus.Open ||
      post.status === PostStatus.Draft ||
      userId
    )
      return
    throw new UserCannotViewPostError()
  }

  verifyPetitionOwner = (post: Post, userId?: string): boolean => {
    // If post is private or archived, only petition owner sees a personalised message
    if (userId) {
      // check that user id is the same as post user id
      const postUserId = post.hashedUserSgid
      return postUserId === userId
    }
    return false
  }
}
