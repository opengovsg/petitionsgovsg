import { ApiClient, BaseUserNameDto } from '../api'

export const sendOtp = (email: string): Promise<void> => {
  return ApiClient.post('/auth/sendotp', { email })
}

export const verifyOtp = async (data: {
  email: string
  otp: string
}): Promise<void> => {
  return ApiClient.post('/auth/verifyotp', data)
}

export const getUserName = async (): Promise<BaseUserNameDto> => {
  return ApiClient.get<BaseUserNameDto>(`/auth/fullname`, {}).then(
    ({ data }) => data,
  )
}
export const GET_USER_NAME = 'getUserName'
