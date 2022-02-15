import { AxiosResponse } from 'axios'
import {
  CreatePostReqDto,
  ListPostsDto,
  PostWithAddresseeAndSignatures,
  UpdatePostReqDto,
  CreatePostResDto,
  UpdatePostResDto,
} from '~shared/types/api'
import { ApiClient } from '../api'

const POST_API_BASE = '/posts'

export const getPostById = async (
  id: number,
): Promise<PostWithAddresseeAndSignatures> => {
  return ApiClient.get<PostWithAddresseeAndSignatures>(
    `${POST_API_BASE}/${id}`,
    {},
  ).then(({ data }) => data)
}
export const GET_POST_BY_ID_QUERY_KEY = 'getPostById'

export const listPosts = async (
  sort?: string,
  page?: number,
  size?: number,
): Promise<ListPostsDto> => {
  return ApiClient.get<ListPostsDto>(`${POST_API_BASE}`, {
    params: {
      sort,
      page,
      size,
    },
  }).then(({ data }) => data)
}
export const LIST_POSTS_QUERY_KEY = 'listPosts'
export const LIST_POSTS_FOR_SEARCH_QUERY_KEY = 'listPostsForSearch'

export const updatePost = async (
  id: number,
  update: UpdatePostReqDto,
): Promise<UpdatePostResDto> => {
  return ApiClient.put<UpdatePostReqDto, AxiosResponse<UpdatePostResDto>>(
    `${POST_API_BASE}/${id}`,
    update,
  ).then(({ data }) => data)
}

export const createPost = async (
  postData: CreatePostReqDto,
): Promise<CreatePostResDto> => {
  return ApiClient.post<CreatePostReqDto, AxiosResponse<CreatePostResDto>>(
    `${POST_API_BASE}`,
    postData,
  ).then(({ data }) => data)
}

export const deletePost = async (postId: number): Promise<unknown> => {
  return ApiClient.delete(`${POST_API_BASE}/${postId}`).then(({ data }) => data)
}

export const publishPost = async (postId: number): Promise<unknown> => {
  return ApiClient.put(`${POST_API_BASE}/${postId}`).then(({ data }) => data)
}
