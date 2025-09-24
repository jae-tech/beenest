import { createFileRoute } from '@tanstack/react-router'
import { InventoryHistoryPage } from '@/features/inventory/components/InventoryHistoryPage'

export const Route = createFileRoute('/_authenticated/inventory/history/$productId')({
  component: InventoryHistoryPage,
})