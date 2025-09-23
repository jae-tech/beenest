import { createFileRoute } from '@tanstack/react-router'
import { InventoryHistoryPage } from '@/features/inventory/components/InventoryHistoryPage'

export const Route = createFileRoute('/_layout/inventory/history/$productId')({
  component: InventoryHistoryPage,
})