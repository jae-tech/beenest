import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

interface LoginSearch {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) ?? undefined,
    }
  },
  beforeLoad: ({ context, search }) => {
    // 이미 인증된 사용자는 대시보드로 리다이렉트
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || '/dashboard',
      })
    }
  },
  component: LoginForm,
})