import { getAPIClient } from '@services/axios'
import { Role } from '@utils/enums'
import { User } from '@context/AuthContext'

export const login = async (email: string, password: string) => {
  const apiClient = getAPIClient(undefined, true)

  const { data } = await apiClient.post('/v1/login', {
    email,
    password,
  })

  return data
}

export const updateCurrentRole = async (currentRole: Role) => {
  const apiClient = getAPIClient()
  const { data } = await apiClient.put<User>('v1/user/current-role', { currentRole })
  return data
}

export async function getUser() {
  const apiClient = getAPIClient()
  const { data } = await apiClient.get<User>('/v1/user')
  return data
}
