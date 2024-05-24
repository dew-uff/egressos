import { AxiosInstance } from 'axios'
import { Email, GetEmailResponse } from '@modules/Emails/types'
import { User } from '@context/AuthContext'
import { getAPIClient } from '@services/axios'
import { FormInfo } from '../../pages/gerenciamento/emails/templates'

export const getEmails = async (
  pageSize: number,
  page = 1,
  formInfo?: FormInfo,
  apiClient: AxiosInstance = getAPIClient()
): Promise<GetEmailResponse> => {
  const userRole = formInfo?.userRole === 'null' ? undefined : formInfo?.userRole
  const name = formInfo?.name === '' ? undefined : formInfo?.name
  const { data } = await apiClient.get<GetEmailResponse>(
    `/v1/emails?` +
      new URLSearchParams({
        page: (page - 1).toString(),
        pageSize: pageSize.toString(),
        ...(userRole ? { userRole } : {}),
        ...(name ? { name } : {}),
      })
  )

  return data
}

export const deleteEmail = async (id: string, apiClient: AxiosInstance = getAPIClient()) => {
  await apiClient.delete<GetEmailResponse>(`/v1/email/${id}`)
}

export const saveEmail = async (email: Email, apiClient: AxiosInstance = getAPIClient()) => {
  await apiClient.post(`/v1/email`, email)
}

export const updateEmail = async (email: Email, apiClient: AxiosInstance = getAPIClient()) => {
  await apiClient.put(`/v1/email/${email.id}`, email)
}

export const getUserByRole = async (
  role: string,
  apiClient: AxiosInstance = getAPIClient()
): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(`/v1/users/role/${role}`)

  return data
}

export const sendEmails = async (
  usersId: string[],
  emailContentId: string,
  sendToPendingHistories: boolean,
  apiClient: AxiosInstance = getAPIClient()
): Promise<void> => {
  await apiClient.post(`/v1/emails/send`, { usersId, emailContentId, sendToPendingHistories })
}
