import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 페이지 로드시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('beenest_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
        console.log('Auth restored from localStorage:', userData)
      } catch (err) {
        console.error('Failed to restore auth:', err)
        localStorage.removeItem('beenest_user')
      }
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      // 임시 로그인 로직 - 추후 실제 API로 교체
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (credentials.email === 'admin@beenest.com' && credentials.password === 'password') {
        const userData: User = {
          id: '1',
          email: credentials.email,
          name: 'Sarah Kim'
        }
        setUser(userData)
        setIsAuthenticated(true)

        if (credentials.rememberMe) {
          localStorage.setItem('beenest_user', JSON.stringify(userData))
        }

        console.log('Login successful, auth state updated')

        // 상태 업데이트 후 약간의 지연을 두고 네비게이션
        setTimeout(() => {
          console.log('Navigating to dashboard...')
          window.location.href = '/dashboard'
        }, 100)
      } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
    localStorage.removeItem('beenest_user')
    console.log('Logout successful, navigating to login')
    window.location.href = '/login'
  }

  const clearError = () => {
    setError(null)
  }


  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError
  }
}