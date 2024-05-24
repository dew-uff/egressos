import { AxiosInstance } from 'axios'
import { CreateInstitution, InstitutionFilters, InstitutionsDTO } from '@modules/Institutions/types'

export const getInstitutions = async (
  apiClient: AxiosInstance,
  page = 1,
  pageSize = 10,
  filters?: InstitutionFilters
): Promise<InstitutionsDTO> => {
  const { name, type } = filters || {}
  const filledFilters = [
    ['page', `${page - 1}`],
    ['pageSize', `${pageSize}`],
  ]
  name && filledFilters.push(['name', name])
  type && filledFilters.push(['type', type])

  const { data } = await apiClient.get<InstitutionsDTO>(
    `/v1/institutions?` + new URLSearchParams(filledFilters)
  )
  return data
}

export const deleteInstitution = async (apiClient: AxiosInstance, id: string) => {
  await apiClient.delete(`/v1/institution/${id}`)
}

export const createInstitution = async (
  apiClient: AxiosInstance,
  institutionDTO: CreateInstitution
) => {
  await apiClient.post(`/v1/institution`, institutionDTO)
}

export const updateInstitution = async (
  apiClient: AxiosInstance,
  institutionDTO: CreateInstitution
) => {
  await apiClient.put(`/v1/institution/${institutionDTO.id}`, institutionDTO)
}
