import { createFileRoute } from '@tanstack/react-router'
import { TransactionDetailPage } from '@/features/transactions/components/TransactionDetailPage'

export const Route = createFileRoute('/_layout/transactions/$transactionId')({
  component: TransactionDetailPage,
})