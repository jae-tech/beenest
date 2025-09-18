import { createFileRoute } from '@tanstack/react-router'
import { SuppliersPage } from '@/features/suppliers/components/SuppliersPage'

export const Route = createFileRoute('/_layout/suppliers/')({
  component: SuppliersPage,
})