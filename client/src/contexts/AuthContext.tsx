import { AxiosError } from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, UseMutationResult } from 'react-query'
import { ApiClient, getApiErrorMessage } from '../api'
import * as AuthService from '../services/AuthService'
import { LoadPublicUserDto } from '~shared/types/api'
import { useStyledToast } from '../components/StyledToast/StyledToast'

interface AuthContextProps {
  user: LoadPublicUserDto
  verifyOtp: UseMutationResult<void, unknown, { email: string; otp: string }>
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
        // Catch 401 which signals an unauthorized user, which is not an issue
        if (!(reason.response?.status === 401)) {
          throw reason
        }
      })
  }

  const verifyOtp = useMutation(AuthService.verifyOtp, {
    onSuccess: () => {
      whoami()
    },
  })

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
    verifyOtp,
    isLoading,
    logout,
  }

  const initialize = () => {
    whoami()
  }

  useEffect(initialize, [])

  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
