import { AxiosResponse } from 'axios'
import { CreateSignatureReqDto } from 'src/api/types/signature'
import { ApiClient } from '../api'

export const getUserSignatureForPost = async (
  postId: number,
): Promise<undefined> =>
  ApiClient.get<undefined>(`/posts/signatures/check/${postId}`).then(
    ({ data }) => data,
  )
export const GET_USER_SIGNATURE_FOR_POST_QUERY_KEY = 'getUserSignatureForPost'

export const createSignature = async (
  postId: number,
  data: CreateSignatureReqDto,
): Promise<undefined> =>
  ApiClient.post<undefined, AxiosResponse<undefined>>(
    `/posts/signatures/${postId}`,
    data,
  ).then(({ data }) => data)
