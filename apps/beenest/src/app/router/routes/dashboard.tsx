import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/DashboardPage'
import { authGuard } from '../guards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: authGuard,
  component: DashboardPage,
})