import { useEffect } from 'react'
import { useAuthStore } from '@/app/store/authStore'
import type { User, LoginCredentials } from '@/types'
import type { RegisterRequest } from '@/types/api'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setLoading,
    clearError,
    checkAuth,
    refreshAuth
  } = useAuthStore()

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // 토큰 갱신 (선택적 - 필요한 경우)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        refreshAuth()
      }
    }, 15 * 60 * 1000) // 15분마다 토큰 갱신

    return () => clearInterval(interval)
  }, [isAuthenticated, refreshAuth])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setLoading,
    clearError,
    checkAuth,
    refreshAuth
  }
}