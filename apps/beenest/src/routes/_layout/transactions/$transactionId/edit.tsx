import { createFileRoute } from '@tanstack/react-router'
import { TransactionEditPage } from '@/features/transactions/components/TransactionEditPage'

export const Route = createFileRoute('/_layout/transactions/$transactionId/edit')({
  component: TransactionEditPage,
})