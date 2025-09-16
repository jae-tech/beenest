import { MetricCard } from '@/components/ui/metric-card/MetricCard'
import { type SupplierStats as SupplierStatsType } from '@/types'

interface SupplierStatsProps {
  stats: SupplierStatsType
}

export const SupplierStats = ({ stats }: SupplierStatsProps) => {
  // SupplierStats 객체를 배열로 변환하여 표시
  const statItems = [
    { label: 'Total Suppliers', value: stats.totalSuppliers },
    { label: 'Active Suppliers', value: stats.activeSuppliers },
    { label: 'Pending Orders', value: stats.pendingOrders },
    { label: 'Average Rating', value: stats.avgRating.toFixed(1) },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}