import { AxiosInstance } from 'axios'
import { getAPIClient } from '@services/axios'

export const sendResetPasswordEmail = async (
  email: string,
  apiClient: AxiosInstance = getAPIClient()
) => {
  const { data } = await apiClient.post('/v1/send-email-reset-password', { email })
  return data
}
interface GetResetPasswordCode {
  userEmail: string
  isExpired: boolean
}
export const getResetPasswordCode = async (
  code: string,
  apiClient: AxiosInstance = getAPIClient()
): Promise<GetResetPasswordCode> => {
  const { data } = await apiClient.get(`/v1/reset-password-code/${code}`)
  return data
}
export const changePassword = async (
  code: string,
  newPassword: string,
  apiClient: AxiosInstance = getAPIClient()
) => {
  await apiClient.put(`/v1/user/change-password`, { code, newPassword })
}
