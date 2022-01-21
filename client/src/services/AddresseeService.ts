import { AxiosResponse } from 'axios'
import { CreateSignatureReqDto } from 'src/api/types/signature'
import { ApiClient } from '../api'

export const getAddressees = async (): Promise<undefined> =>
  ApiClient.get<undefined>(`/addressees`).then(({ data }) => data)

export const GET_ADDRESSEES_QUERY_KEY = 'getAddressees'

export const createSignature = async (
  postId: number,
  data: CreateSignatureReqDto,
): Promise<undefined> =>
  ApiClient.post<undefined, AxiosResponse<undefined>>(
    `/posts/signatures/${postId}`,
    data,
  ).then(({ data }) => data)
