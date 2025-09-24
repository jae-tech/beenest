import { createFileRoute } from '@tanstack/react-router'
import { AddTransactionPage } from '@/features/transactions/components/AddTransactionPage'

export const Route = createFileRoute('/_authenticated/transactions/add')({
  component: AddTransactionPage,
})