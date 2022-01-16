import type { Sequelize as SequelizeType } from 'sequelize'
import Sequelize, {
  Model,
  ModelCtor,
  OrderItem,
  ProjectionAlias,
} from 'sequelize'
import { Post, PostStatus } from '~shared/types/base'
import { Signature, User } from '../../models'
import { ModelDef } from '../../types/sequelize'
import { SortType } from '../../types/sort-type'
import { MissingPublicPostError, PostUpdateError } from './post.errors'

export type PostWithUserAndSignatures = Model &
  Post & {
    user: Pick<User, 'displayname'>
    countAnswers: () => number
    signatures: Signature[]
  }
export class PostService {
  private Signature: ModelCtor<Signature>
  private Post: ModelDef<Post>
  private User: ModelCtor<User>
  private sequelize: SequelizeType

  constructor({
    Signature,
    Post,
    User,
    sequelize,
  }: {
    Signature: ModelCtor<Signature>
    Post: ModelDef<Post>
    User: ModelCtor<User>
    sequelize: SequelizeType
  }) {
    this.Signature = Signature
    this.Post = Post
    this.User = User
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
   * @param agencyId Agency id to filter by
   * @param tags Tags to filter by
   * @param topics Topics to filter by
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
    //return posts filtered by agency, topics and tags
    const posts = (await this.Post.findAll({
      where: whereobj,
      order: [orderarray],
      include: [
        { model: this.User, required: true, attributes: ['displayname'] },
        this.Signature,
      ],
      attributes: [
        'createdAt',
        'updatedAt',
        'status',
        'title',
        'summary',
        'reason',
        'request',
        'userId',
        'references',
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
   * Get a single post and all the tags, topic and users associated with it
   * @param postId Id of the post
   * @param noOfRelatedPosts number of related posts to show
   */
  getSinglePost = async (
    postId: number,
  ): Promise<PostWithUserAndSignatures> => {
    const post = (await this.Post.findOne({
      where: {
        status: PostStatus.Open,
        id: postId,
      },
      include: [
        { model: this.User, attributes: ['displayname'] },
        this.Signature,
      ],
      attributes: [
        'createdAt',
        'updatedAt',
        'status',
        'title',
        'summary',
        'reason',
        'request',
        'userId',
        'references',
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
    summary: string
    reason: string | null
    request: string | null
    userId: number
    references: string | null
  }): Promise<number> => {
    try {
      const postId = await this.sequelize.transaction(async (transaction) => {
        const post = await this.Post.create(
          { ...newPost, status: PostStatus.Draft },
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
