import { AxiosResponse } from 'axios'
import { ApiClient } from '@/api'
import { CreateSubscriptionReqDto } from '~shared/types/api'

export const createSubscription = async (
  postId: string | undefined,
  data: CreateSubscriptionReqDto,
): Promise<undefined> =>
  ApiClient.post<undefined, AxiosResponse<undefined>>(
    `/subscriptions/${postId}`,
    data,
  ).then(({ data }) => data)
