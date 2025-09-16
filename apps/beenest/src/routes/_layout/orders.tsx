import { createFileRoute } from '@tanstack/react-router'
import { OrdersPage } from '@/features/orders/components/OrdersPage'

export const Route = createFileRoute('/_layout/orders')({
  component: OrdersPage,
})