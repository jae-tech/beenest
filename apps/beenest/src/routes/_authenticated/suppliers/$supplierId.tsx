import { createFileRoute } from '@tanstack/react-router'
import { SupplierDetailPage } from '@/features/suppliers/components/SupplierDetailPage'

export const Route = createFileRoute('/_authenticated/suppliers/$supplierId')({
  component: SupplierDetailPage,
})