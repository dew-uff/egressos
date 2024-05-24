import { Role } from '@utils/enums'

export interface SelectItem {
  id: any
  label: string
}

export const RolesByPaths = {
  '/egressos': [Role.ADMIN, Role.PROFESSOR],
  '/egressos/[graduateId]': [Role.ADMIN, Role.PROFESSOR, Role.GRADUATE],
  '/gerenciamento': [Role.ADMIN],
}
