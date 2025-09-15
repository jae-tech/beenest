import { useAuthStore } from '@/app/store/authStore'
import { useMutation } from '@tanstack/react-query'
import type { LoginCredentials } from '@/shared/types'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError
  } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await login(credentials)
    },
    onError: () => {
      // Error is already handled in the store
    },
  })

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,
    error: error || (loginMutation.error as Error)?.message,
    login: loginMutation.mutate,
    logout,
    clearError,
  }
}