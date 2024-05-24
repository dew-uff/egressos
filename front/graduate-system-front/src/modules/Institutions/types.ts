import { InstitutionType } from '@modules/InstitutionTypes/types'
import { PaginationType } from '@modules/Commons/types'

export interface CreateInstitution {
  id?: string
  name: string
  typeId: string
}
export interface Institution {
  id: string
  name: string
  type: InstitutionType
}

export interface InstitutionsDTO {
  meta: PaginationType
  data: Institution[]
}

export interface InstitutionFilters {
  name?: string
  type?: string
}
