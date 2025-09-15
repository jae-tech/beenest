import { createFileRoute } from '@tanstack/react-router'
import { SuppliersPage } from '@/pages/SuppliersPage'
import { authGuard } from '../guards'

export const Route = createFileRoute('/suppliers')({
  beforeLoad: authGuard,
  component: SuppliersPage,
})