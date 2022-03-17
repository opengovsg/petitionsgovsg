import { AxiosResponse } from 'axios'
import { Signature } from '~shared/types/base'
import { ApiClient } from '@/api'
import { CreateSignatureReqDto } from '~shared/types/api'

export const getUserSignatureForPost = async (
  postId: string | undefined,
): Promise<undefined> =>
  ApiClient.get<undefined>(`/posts/signatures/check/${postId}`).then(
    ({ data }) => data,
  )
export const GET_USER_SIGNATURE_FOR_POST_QUERY_KEY = 'getUserSignatureForPost'

export const createSignature = async (
  postId: string | undefined,
  data: CreateSignatureReqDto,
): Promise<undefined> =>
  ApiClient.post<undefined, AxiosResponse<undefined>>(
    `/posts/signatures/${postId}`,
    data,
  ).then(({ data }) => data)

export const filterSignaturesWithComments = (
  signatures: Pick<Signature, 'comment' | 'createdAt' | 'fullname' | 'id'>[],
) => {
  return signatures.filter((signature) => signature.comment !== '')
}
