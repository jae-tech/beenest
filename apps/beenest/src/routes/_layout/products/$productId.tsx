import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products'

export const Route = createFileRoute('/_layout/products/$productId')({
  component: ProductDetailPage,
})