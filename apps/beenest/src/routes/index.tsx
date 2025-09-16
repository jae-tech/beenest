import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // 기본적으로 로그인 페이지로 리다이렉트
    throw redirect({ to: '/login' })
  },
})