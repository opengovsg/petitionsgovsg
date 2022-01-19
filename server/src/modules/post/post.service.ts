import type { Sequelize as SequelizeType } from 'sequelize'
import Sequelize, { Model, OrderItem, ProjectionAlias } from 'sequelize'
import { generateSalt } from 'src/util/hash'
import { Post, PostStatus } from '~shared/types/base'
import { Signature } from '../../models'
import { ModelDef } from '../../types/sequelize'
import { SortType } from '../../types/sort-type'
import { MissingPublicPostError, PostUpdateError } from './post.errors'

export type PostWithUserAndSignatures = Model &
  Post & {
    signatureCount: () => number
    signatures: Signature[]
  }
export class PostService {
  private Signature: ModelDef<Signature>
  private Post: ModelDef<Post>
  private sequelize: SequelizeType

  constructor({
    Signature,
    Post,
    sequelize,
  }: {
    Signature: ModelDef<Signature>
    Post: ModelDef<Post>
    sequelize: SequelizeType
  }) {
    this.Signature = Signature
    this.Post = Post
    this.sequelize = sequelize
  }

  private signatureCountLiteral: ProjectionAlias = [
    Sequelize.literal(`(
      SELECT COUNT(*)
      FROM signatures AS signature
      WHERE
        signature.postId = post.id
    )`),
    'signatureCount',
  ]

  private sortFunction = (sortType: SortType): OrderItem => {
    if (sortType === SortType.Basic) {
      return ['updatedAt', 'DESC']
    }
    return ['updatedAt', 'ASC']
  }
  /**
   * Return the paginated posts
   * @param posts post array to be paginated
   * @param page If size is given, specify which page to return
   * @param size Number of posts to return
   * @returns paginated post array and total items in the original array
   */
  private getPaginatedPosts = (
    posts: Post[],
    page?: number,
    size?: number,
  ): {
    posts: Post[]
    totalItems: number
  } => {
    const totalItems = posts.length
    let returnPosts = posts
    if (size) {
      const offset = page ? (page - 1) * size : 0
      returnPosts = returnPosts.slice(offset, Number(offset) + Number(size))
    }
    return {
      posts: returnPosts,
      totalItems: totalItems,
    }
  }

  /**
   * Lists all post
   * @param sort Sort by popularity or recent
   * @param size Number of posts to return
   * @param page If size is given, specify which page to return
   */
  listPosts = async ({
    sort,
    page,
    size,
  }: {
    sort: SortType
    page?: number
    size?: number
  }): Promise<{
    posts: Post[]
    totalItems: number
  }> => {
    const whereobj = {
      status: PostStatus.Open,
    }

    const orderarray = this.sortFunction(sort)
    const posts = (await this.Post.findAll({
      where: whereobj,
      order: [orderarray],
      include: [this.Signature],
      attributes: [
        'id',
        'createdAt',
        'updatedAt',
        'status',
        'title',
        'summary',
        'reason',
        'request',
        'hashedUserSgid',
        'references',
        'fullname',
        this.signatureCountLiteral,
      ],
    })) as PostWithUserAndSignatures[]

    if (!posts) {
      return { posts: [], totalItems: 0 }
    } else {
      return this.getPaginatedPosts(posts, page, size)
    }
  }

  /**
   * Get a single post and all users associated with it
   * @param postId Id of the post
   */
  getSinglePost = async (
    postId: number,
  ): Promise<PostWithUserAndSignatures> => {
    const post = (await this.Post.findOne({
      where: {
        status: PostStatus.Open,
        id: postId,
      },
      include: [this.Signature],
      attributes: [
        'createdAt',
        'updatedAt',
        'status',
        'title',
        'summary',
        'reason',
        'request',
        'hashedUserSgid',
        'references',
        'salt',
        this.signatureCountLiteral,
      ],
    })) as PostWithUserAndSignatures
    if (!post) {
      throw new MissingPublicPostError()
    } else {
      return post
    }
  }

  /**
   * Create a new post
   * @param newPost Post to be created
   * @returns Id of the new post if it is successfully created
   */
  createPost = async (newPost: {
    title: string
    summary: string | null
    reason: string
    request: string
    hashedUserSgid: string
    references: string | null
    fullname: string
    addresseeId: number
    profile: string | null
  }): Promise<number> => {
    try {
      const salt = await generateSalt()
      const postId = await this.sequelize.transaction(async (transaction) => {
        const post = await this.Post.create(
          { ...newPost, salt: salt, status: PostStatus.Draft },
          { transaction },
        )
        return post.id
      })
      return postId
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete a post by setting the post to archive
   * @param id Post to be deleted
   * @returns void if successful
   */
  deletePost = async (id: number): Promise<void> => {
    try {
      await this.sequelize.transaction(async (transaction) => {
        const dbUpdate = await this.Post.update(
          { status: PostStatus.Closed },
          { where: { id: id }, transaction },
        )

        if (!dbUpdate) {
          throw new PostUpdateError()
        }
      })
    } catch (error) {
      throw error
    }
  }
}
