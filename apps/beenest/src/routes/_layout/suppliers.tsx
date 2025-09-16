import { createFileRoute } from '@tanstack/react-router'

const SuppliersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">거래처 관리</h1>
      <p>거래처 관리 페이지입니다.</p>
    </div>
  )
}

export const Route = createFileRoute('/_layout/suppliers')({
  component: SuppliersPage,
})