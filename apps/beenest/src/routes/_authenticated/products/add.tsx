import { createFileRoute } from '@tanstack/react-router'
import AddProductPage from '@/features/products/components/AddProductPage'

export const Route = createFileRoute('/_authenticated/products/add')({
  component: AddProductPage,
})