import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContextType } from '../context/authContext'
import { Roles } from '../utils/enums'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }) => {
  const { pathname, events } = useRouter()
  const [user, setUser] = useState<any>()
  const router = useRouter()

  async function getUser() {
    try {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      if (profile.error) {
        setUser(null)
      } else {
        if (profile.message === 'Unauthenticated') {
          setUser(null)
        } else {
          setUser(profile)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    console.log('passei aqui')
    getUser()
  }, [pathname])

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = async url => {
      if (url !== '/' && !user) {
        await router.push('/')
      } else if (url === '/' && user) {
        if (user.role === Roles.GRADUATE) {
          await router.push('/editar')
        } else {
          await router.push('/listagem')
        }
      }
    }

    // Check that initial route is OK
    if (pathname !== '/' && user === null) {
      router.push('/')
    }

    // Monitor routes
    events.on('routeChangeStart', handleRouteChange)
    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [user])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

const useAuth: any = () => useContext(AuthContext)

export { AuthProvider, useAuth }
