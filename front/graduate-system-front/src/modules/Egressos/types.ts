export interface ListGraduatesFilters {
  name: string
  institutionName: string
  institutionType: string
  advisorName: string
  position: string
  cnpqLevel: string
  successCase: string
}

interface WorkHistoryInfo {
  id: string
  name?: string
  type?: string
}
export interface Graduate {
  id: string
  userId: string
  name: string
  email: string
  status: HISTORY_STATUS
  advisors: string[]
  workPlace: WorkHistoryInfo
  position?: string
}

export enum HISTORY_STATUS {
  PENDING = 'PENDING',
  UPDATED = 'UPDATED',
  UPDATED_PARTIALLY = 'UPDATED_PARTIALLY',
}
