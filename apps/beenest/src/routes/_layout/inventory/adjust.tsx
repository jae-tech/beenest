import { createFileRoute } from '@tanstack/react-router'
import { AdjustStockPage } from '@/features/inventory'

export const Route = createFileRoute('/_layout/inventory/adjust')({
  component: AdjustStockPage,
})