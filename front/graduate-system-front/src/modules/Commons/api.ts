import { AxiosInstance } from 'axios'
import { CNPQLevelInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'
import { getAPIClient } from '@services/axios'

export const getInstitutionTypesOptions = async (
  apiClient: AxiosInstance = getAPIClient()
): Promise<SelectItem[]> => {
  const { data } = await apiClient.get(`/v1/institution/type`)

  return [
    { id: 0, label: 'Nenhum tipo de instituição selecionado' },
    ...data.map(({ name, id }) => ({ id, label: name })),
  ]
}

export const getCNPQLevelsOptions = async (
  apiClient: AxiosInstance = getAPIClient()
): Promise<SelectItem[]> => {
  const { data } = await apiClient.get<CNPQLevelInfo[]>(`/v1/cnpq-levels`)

  return [
    { id: 0, label: 'Nenhuma bolsa selecionada' },
    ...data.map(({ name, id }) => ({ id, label: name })),
  ]
}
