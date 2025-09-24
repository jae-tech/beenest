import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/app/store/authStore'
import { apiClient } from '@/lib/api-client'
import type { User } from '@beenest/types'

export interface AuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContext | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLoading,
    user,
    login: loginStore,
    logout: logoutStore,
    checkAuth: checkAuthStore,
  } = useAuthStore()

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      // 토큰이 있으면 인증 상태 확인
      const token = apiClient.getToken()
      if (token && !isAuthenticated && !isLoading) {
        await checkAuthStore()
      }
    }

    initAuth()
  }, [])

  const auth: AuthContext = {
    isAuthenticated,
    isLoading,
    user,
    login: loginStore,
    logout: logoutStore,
    checkAuth: checkAuthStore,
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}