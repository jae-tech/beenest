import { createFileRoute } from '@tanstack/react-router'
import { InventoryPage } from '@/pages/InventoryPage'
import { authGuard } from '../guards'

export const Route = createFileRoute('/inventory')({
  beforeLoad: authGuard,
  component: InventoryPage,
})