// @types.todo.ts
import { Role } from '@utils/enums'

export type Course = {
  id: string
  program: Program
  minuteDefense: number
  createdAt: Date
}

export type Program = {
  id: string
  initials: string
  active: boolean
  createdAt: Date
}

export type Advisor = {
  id: string
  courses: Course[]
  createdAt: Date
}

export type InstitutionType = {
  id: string
  name: string
}

export type Institution = {
  id: string
  name: string
  type: InstitutionType
}

export type CNPQLevel = {
  id: string
  level: string
}

export type CNPQScholarship = {
  id: string
  level: CNPQLevel
}

export type Graduate = {
  id: string
  courses: Course[]
  cnpqScholarship: CNPQScholarship[]
  createdAt: Date
  postDoctorate: Institution | null
  hasPostDoctorate: boolean | string
  hasCNPQScholarship: boolean | string
  hasFinishedDoctorateOnUFF: boolean | null | 'unknown'
  hasFinishedMasterDegreeOnUFF: boolean | null | 'unknown'
}

export type User = {
  id: string
  name: string
  email: string
  roles: Role[]
  advisor: Advisor | null
  graduate: Graduate | null
  createdAt?: Date
  currentRole: Role
}
