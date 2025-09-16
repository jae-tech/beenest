import { createFileRoute } from '@tanstack/react-router'

const OrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">주문 관리</h1>
      <p>주문 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_layout/orders')({
  component: OrdersPage,
})