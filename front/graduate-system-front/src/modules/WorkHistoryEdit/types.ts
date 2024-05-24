type InstitutionType = {
  id?: number
  name: string
  type: number
}

interface Option {
  id: number | string
  label: string
}

type FormType = {
  email: string
  newEmail?: string
  position?: string
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  institution?: InstitutionType
  postDoctorate?: InstitutionType
  cnpqId?: number
}

interface InstitutionInfo {
  id?: string
  typeId?: string
  typeName?: string
  name?: string
}

interface PostDoctorateInfo {
  id: string
  institution: InstitutionInfo
  startedAt: string
  endedAt: string | null
}

interface CNPQScholarshipInfo {
  id: string
  levelId: string
  startedAt: string
  endedAt: string | null
}

interface WorkHistoryInfo {
  id: string
  institution: InstitutionInfo
  startedAt?: string
  endedAt?: string | null
  position?: string
  modified?: boolean
}

enum Fields {
  WORK_HISTORY = 'workHistory',
  CNPQ_SCHOLARSHIP = 'cnpqScholarship',
  POST_DOCTORATE = 'postDoctorate',
}

interface CIProgram {
  id?: string
  initials: string
}

interface UserLean {
  id: string
  name: string
  email: string
}

interface Course {
  id?: string
  program: CIProgram
  graduate: UserLean
  defenseMinute: string
  titleDate: Date
  advisor: UserLean
}

interface GraduateWorkHistoriesInfo {
  graduateId: string
  graduateName: string
  email: string
  postDoctorate?: PostDoctorateInfo
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  successCase?: string
  courses: Course[]
  cnpqScholarships: CNPQScholarshipInfo[]
  workHistories: WorkHistoryInfo[]
  pendingFields: string[]
  emptyFields: string[]
}

interface CNPQLevelInfo {
  id: string
  name: string
}

interface InstitutionTypeDTO {
  id: string
  name: string
}

interface InstitutionInfoDTO {
  id: string
  name: string
  type: InstitutionTypeDTO
}

export type {
  FormType,
  InstitutionType,
  InstitutionInfo,
  InstitutionInfoDTO,
  Option,
  GraduateWorkHistoriesInfo,
  CNPQLevelInfo,
  WorkHistoryInfo,
  Course,
  UserLean,
}

export { Fields }
