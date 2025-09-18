import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, LoginCredentials } from '@/types'
import { api, apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse, RegisterRequest, User as ApiUser } from '@/types/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  refreshAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginCredentials) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const loginData: LoginRequest = {
              email: credentials.email,
              password: credentials.password
            }

            const response = await api.post<LoginResponse>('/auth/login', loginData)

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Login failed')
            }

            const { user: apiUser, token } = response.data

            // JWT 토큰 저장
            apiClient.setToken(token)

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: 'admin', // 기본값으로 설정, 필요시 API 스키마 확장
              avatar: undefined,
              lastLogin: new Date().toISOString()
            }

            // 사용자 정보 로컬 스토리지에 저장
            localStorage.setItem('user', JSON.stringify(user))

            set((state) => {
              state.user = user
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
            })
          } catch (error: any) {
            set((state) => {
              state.isLoading = false
              state.error = error.error?.message || error.message || 'Login failed'
            })
            throw error
          }
        },

        register: async (data: RegisterRequest) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response = await api.post<LoginResponse>('/auth/register', data)

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Registration failed')
            }

            const { user: apiUser, token } = response.data

            // JWT 토큰 저장
            apiClient.setToken(token)

            // API 사용자 타입을 앱 사용자 타입으로 변환
            const user: User = {
              id: apiUser.id,
              email: apiUser.email,
              name: apiUser.name,
              role: 'admin',
              avatar: undefined,
              lastLogin: new Date().toISOString()
            }

            // 사용자 정보 로컬 스토리지에 저장
            localStorage.setItem('user', JSON.stringify(user))

            set((state) => {
              state.user = user
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
            })
          } catch (error: any) {
            set((state) => {
              state.isLoading = false
              state.error = error.error?.message || error.message || 'Registration failed'
            })
            throw error
          }
        },

        logout: () => {
          // 토큰 및 사용자 정보 제거
          apiClient.removeToken()

          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null
          })
        },

        checkAuth: async () => {
          const token = apiClient.getToken()
          if (!token || !apiClient.isTokenValid()) {
            // 토큰이 없거나 유효하지 않으면 로그아웃 처리
            set((state) => {
              state.user = null
              state.isAuthenticated = false
            })
            return
          }

          try {
            const response = await api.get<ApiUser>('/auth/me')

            if (response.success && response.data) {
              const user: User = {
                id: response.data.id,
                email: response.data.email,
                name: response.data.name,
                role: 'admin',
                avatar: undefined,
                lastLogin: new Date().toISOString()
              }

              localStorage.setItem('user', JSON.stringify(user))

              set((state) => {
                state.user = user
                state.isAuthenticated = true
              })
            } else {
              throw new Error('Authentication check failed')
            }
          } catch (error) {
            // 인증 실패 시 로그아웃 처리
            apiClient.removeToken()
            set((state) => {
              state.user = null
              state.isAuthenticated = false
            })
          }
        },

        refreshAuth: async () => {
          const token = apiClient.getToken()
          if (!token) return

          try {
            const response = await api.post<LoginResponse>('/auth/refresh')

            if (response.success && response.data) {
              const { user: apiUser, token: newToken } = response.data

              apiClient.setToken(newToken)

              const user: User = {
                id: apiUser.id,
                email: apiUser.email,
                name: apiUser.name,
                role: 'admin',
                avatar: undefined,
                lastLogin: new Date().toISOString()
              }

              localStorage.setItem('user', JSON.stringify(user))

              set((state) => {
                state.user = user
                state.isAuthenticated = true
              })
            }
          } catch (error) {
            // 리프레시 실패 시 로그아웃
            apiClient.removeToken()
            set((state) => {
              state.user = null
              state.isAuthenticated = false
            })
          }
        },

        setUser: (user: User) => {
          set((state) => {
            state.user = user
            state.isAuthenticated = true
          })
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading
          })
        },

        clearError: () => {
          set((state) => {
            state.error = null
          })
        },
      })),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
)