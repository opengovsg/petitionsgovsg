import type { Sequelize as SequelizeType } from 'sequelize'
import { Signature, Post, PostStatus } from '~shared/types/base'
import { ModelDef } from '../../types/sequelize'
export class SignatureService {
  private Post: ModelDef<Post>
  private Signature: ModelDef<Signature>
  private sequelize: SequelizeType

  constructor({
    Post,
    Signature,
    sequelize,
  }: {
    Post: ModelDef<Post>
    Signature: ModelDef<Signature>
    sequelize: SequelizeType
  }) {
    this.Post = Post
    this.Signature = Signature
    this.sequelize = sequelize
  }

  /**
   * Returns all signatures to a post
   * @param postId id of the post
   * @returns an array of signatures
   */
  listSignatures = async (postId: number): Promise<Signature[]> => {
    const signatures = await this.Signature.findAll({
      where: { postId },
    })
    return signatures
  }

  /**
   * Create a signature attached to a post
   * @param postId id of post to attach to
   * @param comment signature text
   * @param userId id of user that submitted the signature
   * @returns id of new signature if it is successfully created
   */
  createSignature = async ({
    postId,
    comment,
    userId,
    fullname,
  }: Pick<
    Signature,
    'comment' | 'postId' | 'userId' | 'fullname'
  >): Promise<number> => {
    try {
      const signatureId = await this.sequelize.transaction(
        async (transaction) => {
          const signature = await this.Signature.create(
            {
              postId: postId,
              comment: comment,
              userId: userId,
              fullname: fullname,
            },
            { transaction },
          )
          await this.Post.update(
            { status: PostStatus.Open },
            { where: { id: postId }, transaction },
          )
          return signature.id
        },
      )
      return signatureId
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete a signature.
   * @param id of signature to delete
   */
  deleteSignature = async (id: number): Promise<void> => {
    await this.Signature.destroy({ where: { id } })
  }

  checkUserHasSigned = async (
    postId: number,
    userId: number,
  ): Promise<Signature | null> => {
    // Hash user id / sgid with salt
    const signature = await this.Signature.findOne({
      where: { userId: userId, postId: postId },
    })
    return signature
  }
}
