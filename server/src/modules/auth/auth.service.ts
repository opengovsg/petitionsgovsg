import { Post, PostStatus } from '~shared/types/base'
import { ModelDef } from '../../types/sequelize'

export class AuthService {
  private Post: ModelDef<Post>

  constructor({ Post }: { Post: ModelDef<Post> }) {
    this.Post = Post
  }

  /**
   * Check if a user has permission to edit a post
   * @param userId of user
   * @param postId of post
   * @returns true if user has permission to answer post
   */
  hasPermissionToEditPost = async (
    userId: number,
    postId: number,
  ): Promise<boolean> => {
    // TODO:
    return true
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
    if (post.status === PostStatus.Open) return

    // If private or archived, must be logged in
    if (!userId)
      throw new Error('User must be logged in to access private post')

    // TODO
    // const user = await this.User.findOne({ where: { id: userId } })

    // if (user) {
    //   // If officer, they may have permission to answer
    //   if (await this.hasPermissionToEditPost(user.id, post.id)) return

    //   // If none of the above, they must have created the post
    //   if (user.id === post.userId) return
    //   throw new Error('User does not have permission to access post')

    return
  }
}
