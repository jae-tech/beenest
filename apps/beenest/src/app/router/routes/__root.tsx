import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/app/store/authStore'
import { AppLayout } from '@/shared/ui/layout/AppLayout'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Outlet />
  }

  return <AppLayout />
}