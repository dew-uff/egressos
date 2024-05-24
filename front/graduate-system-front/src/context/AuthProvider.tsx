import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import { useRouter } from 'next/router'
import { User } from '@context/AuthContext'
import { Role, Routes, USER_TOKEN_NAME } from '@utils/enums'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { redirectAccordingRole } from '@utils/functions'
import { getUser, login, updateCurrentRole } from '@context/api'

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export type AuthContextType = {
  user: User | null
  currentRole?: Role
  setUser: Dispatch<SetStateAction<User>>
  getUser: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  isAuthenticated: () => boolean
  logout: () => void
  updateCurrentRole: (currentRole: Role) => void
}

const publicRoutes: string[] = [Routes.LOGIN, Routes.RESET_PASSWORD]

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const { currentRole } = user || {}
  const router = useRouter()
  const path = router.pathname

  const isAuthenticated = () => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()
    return !!token
  }

  const handleUpdateCurrentRole = async (role: Role) => {
    const { currentRole } = await updateCurrentRole(role)
    const currentUser = { ...user, currentRole } as User
    setUser(currentUser)
    await redirectAccordingRole(currentRole, currentUser.id, router)
  }

  const handleLogout = async () => {
    setUser(null)
    destroyCookie(undefined, USER_TOKEN_NAME)
    await router.push(Routes.LOGIN)
  }

  async function handleGetUser() {
    try {
      const user = await getUser()
      setUser(user)
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()
    if (token || token === '') {
      handleGetUser()
    }
  }, [])

  useEffect(() => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()
    if (!publicRoutes.includes(path) && !user && !token) router.push(Routes.LOGIN)
  }, [user])

  useEffect(() => {
    if (publicRoutes.includes(path) && user && user.currentRole) {
      redirectAccordingRole(user.currentRole, user.id, router)
    }
  }, [user])

  async function handleLogin(email: string, password: string) {
    const { user, token } = await login(email, password)
    if (!user || !token) return
    setCookie(undefined, USER_TOKEN_NAME, token)
    setUser(user)
    await redirectAccordingRole(user.currentRole, user.id, router)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setUser,
        getUser: handleGetUser,
        login: handleLogin,
        isAuthenticated,
        logout: handleLogout,
        updateCurrentRole: handleUpdateCurrentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth: () => AuthContextType = () => useContext(AuthContext)

export { AuthProvider, useAuth }
