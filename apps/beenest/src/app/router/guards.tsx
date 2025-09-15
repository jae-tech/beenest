import { useAuthStore } from '@/app/store/authStore'
import { redirect } from '@tanstack/react-router'

export function authGuard() {
  const { isAuthenticated } = useAuthStore.getState()

  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
    })
  }
}

export function guestGuard() {
  const { isAuthenticated } = useAuthStore.getState()

  if (isAuthenticated) {
    throw redirect({
      to: '/dashboard',
    })
  }
}