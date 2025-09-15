import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { guestGuard } from '../guards'

export const Route = createFileRoute('/login')({
  beforeLoad: guestGuard,
  component: LoginPage,
})