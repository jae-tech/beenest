import { SupplierStats } from './SupplierStats'
import { SupplierTable } from './SupplierTable'
import { useSuppliers } from '../hooks/useSuppliers'
import { Plus } from 'lucide-react'

export const SuppliersPage = () => {
  const { stats, suppliers, isLoading, error, refetch } = useSuppliers()

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />Add New Supplier
        </button>
      </div>

      <SupplierStats stats={stats} />
      <SupplierTable suppliers={suppliers} />
    </div>
  )
}