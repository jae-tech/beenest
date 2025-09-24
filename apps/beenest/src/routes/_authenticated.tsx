import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  id: '_authenticated',
  beforeLoad: async ({ context, location }) => {
    // 인증되지 않았다면 로그인 페이지로 리다이렉트
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AppLayout,
})