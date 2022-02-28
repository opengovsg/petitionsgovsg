import type { Sequelize as SequelizeType } from 'sequelize'
import Sequelize, { Model, Op, OrderItem, ProjectionAlias } from 'sequelize'
import {
  ListPostsDto,
  PostWithAddresseeAndSignatures,
  UpdatePostReqDto,
} from '~shared/types/api'
import { Addressee, Post, PostStatus, Signature } from '~shared/types/base'
import { ModelDef } from '@/types/sequelize'
import { SortType } from '~shared/types/base/post'
import {
  AddresseeDoesNotExistError,
  MissingPublicPostError,
  PostUpdateError,
} from './post.errors'

export class PostService {
  private Signature: ModelDef<Signature>
  private Post: ModelDef<Post>
  private Addressee: ModelDef<Addressee>
  private sequelize: SequelizeType

  constructor({
    Signature,
    Post,
    Addressee,
    sequelize,
  }: {
    Signature: ModelDef<Signature>
    Post: ModelDef<Post>
    Addressee: ModelDef<Addressee>
    sequelize: SequelizeType
  }) {
    this.Signature = Signature
    this.Post = Post
    this.Addressee = Addressee
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
    const sortDict = {
      [SortType.Newest]: ['createdAt', 'DESC'],
      [SortType.Oldest]: ['createdAt', 'ASC'],
      [SortType.MostSignatures]: [Sequelize.literal('signatureCount'), 'DESC'],
      [SortType.LeastSignatures]: [Sequelize.literal('signatureCount'), 'ASC'],
    }

    return sortDict[sortType] as OrderItem
  }
  /**
   * Return the paginated posts
   * @param posts post array to be paginated
   * @param page If size is given, specify which page to return
   * @param size Number of posts to return
   * @returns paginated post array and total items in the original array
   */
  private getPaginatedPosts = (
    posts: PostWithAddresseeAndSignatures[],
    page?: number,
    size?: number,
  ): {
    posts: PostWithAddresseeAndSignatures[]
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
  }): Promise<ListPostsDto> => {
    const whereobj = {
      status: PostStatus.Open,
    }

    const orderarray = this.sortFunction(sort)

    const posts = (await this.Post.findAll({
      where: whereobj,
      order: [orderarray],
      include: [
        this.Signature,
        {
          model: this.Addressee,
          required: false,
          attributes: ['name', 'shortName'],
        },
      ],
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
        'addresseeId',
        'profile',
        'email',
        this.signatureCountLiteral,
      ],
    })) as (Model & PostWithAddresseeAndSignatures)[]

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
  ): Promise<PostWithAddresseeAndSignatures> => {
    const post = (await this.Post.findOne({
      where: {
        [Op.or]: [{ status: PostStatus.Open }, { status: PostStatus.Draft }],
        id: postId,
      },
      include: [
        this.Signature,
        {
          model: this.Addressee,
          required: false,
          attributes: ['name', 'shortName'],
        },
      ],
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
        'fullname',
        'addresseeId',
        'profile',
        'email',
        this.signatureCountLiteral,
      ],
    })) as Model & PostWithAddresseeAndSignatures
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
    email: string
    salt: string
  }): Promise<number> => {
    // Check if addresseeId is valid
    const addresseeExists = await this.Addressee.findByPk(newPost.addresseeId)
    if (!addresseeExists) {
      throw new AddresseeDoesNotExistError()
    }
    const postId = await this.sequelize.transaction(async (transaction) => {
      const post = await this.Post.create(
        { ...newPost, status: PostStatus.Draft },
        { transaction },
      )
      return post.id
    })
    return postId
  }

  /**
   * Delete a post by setting the post to archive
   * @param id Post to be deleted
   * @returns void if successful
   */
  deletePost = async (id: number): Promise<void> => {
    try {
      await this.sequelize.transaction(async (transaction) => {
        const [dbUpdate] = await this.Post.update(
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

  /**
   * Update a post
   * @param id Post to be updated
   * @returns boolean Indicate if update was successful
   */
  updatePost = async ({
    id,
    title,
    summary,
    reason,
    request,
    references,
    addresseeId,
    profile,
    email,
  }: UpdatePostReqDto & { id: number }): Promise<boolean> => {
    // Check if addresseeId is valid
    const addresseeExists = await this.Addressee.findByPk(addresseeId)
    if (!addresseeExists) {
      throw new AddresseeDoesNotExistError()
    }

    const updated = await this.sequelize.transaction(async (transaction) => {
      const dbUpdate = await this.Post.update(
        {
          title,
          summary,
          reason,
          request,
          references,
          addresseeId,
          profile,
          email,
        },
        {
          where: { id: id },
          transaction,
        },
      )
      return dbUpdate
    })
    return !!updated
  }

  /**
   * Change post status to Open
   * @param id Post to be published
   * @returns void if successful
   */
  publishPost = async (id: number): Promise<void> => {
    await this.sequelize.transaction(async (transaction) => {
      const [dbUpdate] = await this.Post.update(
        { status: PostStatus.Open },
        { where: { id: id }, transaction },
      )
      if (!dbUpdate) {
        throw new PostUpdateError()
      }
    })
  }
}
