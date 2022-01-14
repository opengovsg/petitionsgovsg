import minimatch from 'minimatch'
import { ModelCtor } from 'sequelize'
import { Post, PostStatus } from '~shared/types/base'
import { User } from '../../models'
import { ModelDef } from '../../types/sequelize'

export class AuthService {
  private emailValidator
  private User: ModelCtor<User>
  private Post: ModelDef<Post>

  constructor({
    emailValidator,
    User,
    Post,
  }: {
    emailValidator: minimatch.IMinimatch
    User: ModelCtor<User>
    Post: ModelDef<Post>
  }) {
    this.emailValidator = emailValidator
    this.User = User
    this.Post = Post
  }

  /**
   * Check if a user has permission to answer a post
   * @param userId of user
   * @param postId of post
   * @returns true if user has permission to answer post
   */
  hasPermissionToAnswer = async (
    userId: number,
    postId: number,
  ): Promise<boolean> => {
    const user = await this.User.findByPk(userId)
    const post = await this.Post.findByPk(postId)

    return Boolean(post && user)
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
    const user = await this.User.findOne({ where: { id: userId } })

    if (user) {
      // If officer, they may have permission to answer
      if (await this.hasPermissionToAnswer(user.id, post.id)) return

      // If none of the above, they must have created the post
      if (user.id === post.userId) return
      throw new Error('User does not have permission to access post')
    }
  }
}
