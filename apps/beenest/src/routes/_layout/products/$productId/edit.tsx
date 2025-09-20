import { createFileRoute } from '@tanstack/react-router'
import ProductEditPage from '@/features/products/components/ProductEditPage'

export const Route = createFileRoute('/_layout/products/$productId/edit')({
  component: ProductEditPage,
})