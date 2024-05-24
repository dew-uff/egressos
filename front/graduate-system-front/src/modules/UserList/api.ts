import { AxiosInstance } from 'axios'
import { getAPIClient } from '@services/axios'

export const createUpdateUser = async (apiClient: AxiosInstance, user) => {
  await apiClient.post('/v1/register', user)
}

interface GetUsersFilters {
  name?: string
  email?: string
}
export const getUsers = async (
  apiClient: AxiosInstance,
  page = 1,
  pageSize = 10,
  filters?: GetUsersFilters
) => {
  const { name, email } = filters || {}
  const filledFilters = [
    ['page', `${page - 1}`],
    ['pageSize', `${pageSize}`],
  ]
  name && filledFilters.push(['name', name])
  email && filledFilters.push(['email', email])

  const url = '/v1/users?' + new URLSearchParams(filledFilters)

  const { data } = await apiClient.get(url)
  return data
}

export const importCSV = async (csvFile: File, isDoctorateGraduates: boolean) => {
  const apiClient = getAPIClient()
  const formData = new FormData()
  formData.append('file', csvFile)
  formData.append('isDoctorateGraduates', String(isDoctorateGraduates))
  const { data } = await apiClient.post('/v1/graduates/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
