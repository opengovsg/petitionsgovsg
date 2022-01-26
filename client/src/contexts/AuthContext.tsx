import { AxiosError } from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { ApiClient, getApiErrorMessage } from '../api'
import { LoadPublicUserDto } from '~shared/types/api'
import { useStyledToast } from '../components/StyledToast/StyledToast'
import { useLocation } from 'react-router-dom'

interface AuthContextProps {
  user: LoadPublicUserDto
  isLoading: boolean
  logout: () => void
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
  const toast = useStyledToast()
  const [user, setUser] = useState<LoadPublicUserDto>(null)
  const { pathname } = useLocation()

  const whoami = () => {
    setLoading(true)
    ApiClient.get<LoadPublicUserDto>('/auth')
      .then(({ data }) => {
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

  const logout = () => {
    ApiClient.post('/auth/logout')
      .then(() => {
        setUser(null)
      })
      .catch((error) => {
        toast({
          status: 'error',
          description: getApiErrorMessage(error),
        })
      })
  }

  const auth = {
    user,
    isLoading,
    logout,
  }

  const initialize = () => {
    whoami()
  }

  useEffect(initialize, [pathname])

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
