import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth/components/RegisterPage'

interface RegisterSearch {
  redirect?: string
}

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
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
  component: RegisterPage,
})