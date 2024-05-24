import { Role, Routes } from '@utils/enums'
import { NextRouter } from 'next/router'

interface HomeUrlAccordingRoleProps {
  pathname: Routes
  query?: { id: string }
}

export const getHomeUrlAccordingRole = (currentRole: Role, id: string): HomeUrlAccordingRoleProps =>
  currentRole === Role.GRADUATE
    ? { pathname: Routes.GRADUATE, query: { id } }
    : { pathname: Routes.GRADUATES }

export const redirectAccordingRole = async (
  currentRole: Role,
  userId: string,
  router: NextRouter
) => {
  const routeInfo = getHomeUrlAccordingRole(currentRole, userId)
  routeInfo && (await router.push(routeInfo))
}

export const hexWithOpacity = (hex: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255).toString(16)
  return `${hex}${opacityHex}`
}

export const isNullOrUndefinedOrEmpty = (value?: string): boolean =>
  value === null || value === undefined || value === ''

export const passwordIsValid = (password: string): boolean => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/
  return regex.test(password)
}

export const transformNumberToValue = (n: number) => (n === 1 ? true : n === 0 ? false : undefined)

export const transformBoolToNumber = (value?: boolean | null) =>
  value === true ? 1 : value === false ? 0 : -1
