import { ApiClient } from '@/api'

export const getAddressees = async (): Promise<undefined> =>
  ApiClient.get<undefined>(`/addressees`).then(({ data }) => data)

export const GET_ADDRESSEES_QUERY_KEY = 'getAddressees'
