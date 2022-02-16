import type { Sequelize as SequelizeType } from 'sequelize'
import { Signature, Post } from '~shared/types/base'
import { ModelDef } from '@/types/sequelize'

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
    hashedUserSgid,
    fullname,
  }: Pick<
    Signature,
    'comment' | 'postId' | 'hashedUserSgid' | 'fullname'
  >): Promise<number> => {
    const signatureId = await this.sequelize.transaction(
      async (transaction) => {
        const signature = await this.Signature.create(
          {
            postId: postId,
            comment: comment,
            hashedUserSgid: hashedUserSgid,
            fullname: fullname,
          },
          { transaction },
        )
        return signature.id
      },
    )
    return signatureId
  }

  /**
   * Checks if a user has signed a petition
   * @param post with signatures and addressees
   * @param hashedUserSgid of user against petition's salt
   */
  checkUserHasSigned = async (
    postId: number,
    hashedUserSgid: string,
  ): Promise<Signature | null> => {
    // Hash user id / sgid with salt
    const signatureModelInstance = await this.Signature.findOne({
      where: { hashedUserSgid: hashedUserSgid, postId: postId },
    })

    if (!signatureModelInstance) {
      return null
    }

    return signatureModelInstance.get()
  }
}
