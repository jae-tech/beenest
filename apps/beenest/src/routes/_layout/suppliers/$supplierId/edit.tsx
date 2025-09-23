import { createFileRoute } from '@tanstack/react-router'
import { SupplierEditPage } from '@/features/suppliers/components/SupplierEditPage'

export const Route = createFileRoute('/_layout/suppliers/$supplierId/edit')({
  component: SupplierEditPage,
})