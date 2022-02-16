import { AxiosError } from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { ApiClient } from '@/api'
import { LoadPublicUserDto } from '~shared/types/api'
import { useLocation } from 'react-router-dom'

interface AuthContextProps {
  user: LoadPublicUserDto
  isLoading: boolean
}

const authContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = (): AuthContextProps => {
  const auth = useContext(authContext)
  if (!auth) throw new Error('useAuth must be used within an AuthProvider')
  return auth
}

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<LoadPublicUserDto>(null)
  const { pathname } = useLocation()

  const whoami = () => {
    setLoading(true)
    ApiClient.get<LoadPublicUserDto>('/auth')
      .then(({ data, headers }) => {
        ApiClient.defaults.headers.common['xsrf-token'] = headers['xsrf-token']
        if (data) {
          setUser(data)
        }
        setLoading(false)
      })
      .catch((reason: AxiosError) => {
        setLoading(false)
        setUser(null)
        // Catch 401 which signals an unauthorized user, which is not an issue
        if (!(reason.response?.status === 401)) {
          throw reason
        }
      })
  }

  const auth = {
    user,
    isLoading,
  }

  const initialize = () => {
    whoami()
  }

  useEffect(initialize, [pathname])

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
