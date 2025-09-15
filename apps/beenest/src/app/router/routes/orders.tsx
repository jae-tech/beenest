import { createFileRoute } from '@tanstack/react-router'
import { OrdersPage } from '@/pages/OrdersPage'
import { authGuard } from '../guards'

export const Route = createFileRoute('/orders')({
  beforeLoad: authGuard,
  component: OrdersPage,
})