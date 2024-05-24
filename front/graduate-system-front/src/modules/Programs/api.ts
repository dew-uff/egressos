import { AxiosInstance } from 'axios'
import { CIProgramInfo } from '@modules/Programs/types'

export const getPrograms = async (apiClient: AxiosInstance): Promise<CIProgramInfo[]> => {
  const { data } = await apiClient.get('/v1/ci-programs')
  return data
}

export const deleteProgram = async (apiClient: AxiosInstance, id: string) => {
  await apiClient.delete(`/v1/ci-program/${id}`)
}

export const saveProgram = async (apiClient: AxiosInstance, initials: string) => {
  await apiClient.post(`/v1/ci-program`, { initials })
}

export const updateProgram = async (apiClient: AxiosInstance, id: string, initials: string) => {
  await apiClient.put(`/v1/ci-program/${id}`, { initials })
}
