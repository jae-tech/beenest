import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, LoginCredentials } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock validation
            if (credentials.email !== 'admin@beenest.com' || credentials.password !== 'password') {
              throw new Error('Invalid credentials')
            }

            const user: User = {
              id: '1',
              email: credentials.email,
              name: '관리자',
              avatar: undefined,
              role: 'admin'
            }

            set((state) => {
              state.user = user
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
            })
          } catch (error) {
            set((state) => {
              state.isLoading = false
              state.error = error instanceof Error ? error.message : 'Login failed'
            })
            throw error
          }
        },

        logout: () => {
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null
          })
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