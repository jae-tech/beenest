import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    console.log('Root route - Auth check:', context.auth.isAuthenticated)

    if (context.auth.isAuthenticated) {
      console.log('User authenticated, redirecting to dashboard')
      throw redirect({ to: '/dashboard' })
    } else {
      console.log('User not authenticated, redirecting to login')
      throw redirect({ to: '/login' })
    }
  },
})