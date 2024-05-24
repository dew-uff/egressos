import { PaginationType } from '@modules/Commons/types'
import { Role } from '@utils/enums'

export interface Email {
  id?: string
  title: string
  name: string
  content: string
  buttonText: string
  buttonURL: string
  userRole: Role
  active: boolean
}

export interface GetEmailResponse {
  data: Email[]
  meta: PaginationType
}
