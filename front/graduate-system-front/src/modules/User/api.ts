import { AxiosInstance } from 'axios'
import { getAPIClient } from '@services/axios'

interface User {
  id?: string
  name?: string
  email?: string
  currentRole?: string
  roles?: string[]
  sendEmailToAdminOnSave?: boolean
}

interface UserLean {
  id: string
  name: string
  email: string
}

interface CIProgram {
  initials: string
}

interface Course {
  program: CIProgram
  graduate: UserLean
  defenseMinute: string
  titleDate: Date
  advisor: UserLean
}

interface Institution {
  id: string
  typeId: string
  typeName: string
  name: string
}

interface PostDoctorate {
  id?: string
  institution?: Institution
  startedAt?: Date
  endedAt?: Date
}

interface CNPQScholarship {
  id: string
  levelId: string
  startedAt: Date
  endedAt?: Date
}

interface WorkHistory {
  id: string
  institution: Institution
  startedAt: Date
  endedAt?: Date
  position?: string
}

interface Graduate {
  id?: string
  courses?: Course[]
  newCourses?: Course[]
  postDoctorate?: PostDoctorate
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  successCase?: string
  cnpqScholarships?: CNPQScholarship[]
  workHistories?: WorkHistory[]
}

interface Advisor {
  id?: string
  courses: Course[]
  newCourses?: Course[]
}

export interface UserInfo {
  user?: User
  graduate?: Graduate
  advisor?: Advisor
}
export const getUser = async (id: string, apiClient: AxiosInstance): Promise<UserInfo> => {
  const { data } = await apiClient.get('/v1/user/' + id)
  return data
}

export const getAdvisors = async (
  name: string,
  apiClient: AxiosInstance = getAPIClient()
): Promise<UserLean[]> => {
  const { data } = await apiClient.get(`v1/advisors?name=${name}&pageSize=100`)
  return data
}

export const getGraduates = async (
  name: string,
  apiClient: AxiosInstance = getAPIClient()
): Promise<UserLean[]> => {
  const { data } = await apiClient.get(`v1/graduates-lean?name=${name}&pageSize=100`)
  return data
}

export interface CreateCourse {
  id?: string
  program?: string
  defenseMinute: string
  titleDate: Date
  graduate?: string
  advisor?: string
}

interface CreateGraduate {
  id?: string
  courses?: CreateCourse[]
}

interface CreateAdvisor {
  id?: string
  courses?: CreateCourse[]
}

interface CreateUser {
  user: User
  graduate: CreateGraduate
  advisor: CreateAdvisor
}

export const createUpdateUser = async (
  user: CreateUser,
  apiClient: AxiosInstance = getAPIClient()
) => {
  await apiClient.post('v1/register', user)
}
