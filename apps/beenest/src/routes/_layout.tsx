import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'

export const Route = createFileRoute('/_layout')({
  id: '_layout',
  component: AppLayout,
})