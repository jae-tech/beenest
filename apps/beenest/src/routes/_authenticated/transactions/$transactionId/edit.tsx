import { createFileRoute } from '@tanstack/react-router'
import { TransactionEditPage } from '@/features/transactions/components/TransactionEditPage'

export const Route = createFileRoute('/_authenticated/transactions/$transactionId/edit')({
  component: TransactionEditPage,
})