import { Post, PostStatus } from '~shared/types/base'
import { ModelDef } from '../../types/sequelize'
import { UserCannotViewPostError } from '../post/post.errors'

export class AuthService {
  private Post: ModelDef<Post>

  constructor({ Post }: { Post: ModelDef<Post> }) {
    this.Post = Post
  }

  /**
   * Check if a user is able to view the post
   * @param post post to be viewed
   * @param userId id of user
   * @returns true if user can view post
   */
  verifyUserCanViewPost = async (
    post: Post,
    userId?: string,
  ): Promise<void> => {
    // If post is public, anyone can view
    if (post.status === PostStatus.Open || post.status === PostStatus.Draft)
      return

    // If private or archived, must be logged in
    if (!userId) throw new UserCannotViewPostError()

    return
  }

  verifyPetitionOwner = async (
    post: Post,
    userId?: string,
  ): Promise<boolean> => {
    // If post is private or archived, only petition owner sees a personalised message
    if (userId) {
      // check that user id is the same as post user id
      const postUserId = post.hashedUserSgid
      return postUserId === userId
    } else return false
  }
}
