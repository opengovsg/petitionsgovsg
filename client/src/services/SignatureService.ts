import { AxiosResponse } from 'axios'
import { ApiClient } from '../api'

export const getSignaturesForPost = async (
  postId: number,
): Promise<undefined> =>
  ApiClient.get<undefined>(`/posts/answers/${postId}`).then(({ data }) => data)
export const GET_ANSWERS_FOR_POST_QUERY_KEY = 'getAnswersForPost'

export const createSignature = async (
  postId: number,
  // answerData: CreateSignatureReqDto,
): Promise<undefined> =>
  ApiClient.post<undefined, AxiosResponse<undefined>>(
    `/posts/answers/${postId}`,
  ).then(({ data }) => data)
