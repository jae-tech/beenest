import { createFileRoute } from '@tanstack/react-router'
import { InventoryPage } from '@/features/inventory/components/InventoryPage'

export const Route = createFileRoute('/_layout/inventory')({
  component: InventoryPage,
})