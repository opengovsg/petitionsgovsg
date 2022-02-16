import { LoadUserNameDto } from '~shared/types/api'
import { ApiClient } from '@/api'

export const getUserName = async (): Promise<LoadUserNameDto> => {
  return ApiClient.get<LoadUserNameDto>(`/auth/fullname`, {}).then(
    ({ data }) => data,
  )
}
export const GET_USER_NAME = 'getUserName'

export const verifyPetitionOwner = async (postId: number): Promise<boolean> =>
  ApiClient.get<boolean>(`/auth/checkpetitionowner/${postId}`).then(
    ({ data }) => data,
  )
export const VERIFY_PETITION_OWNER = 'verifyPetitionOwner'
