import { MetricCard } from '@/shared/ui/metric-card/MetricCard'
import { SupplierStat } from '../hooks/useSuppliers'

interface SupplierStatsProps {
  stats: SupplierStat[]
}

export const SupplierStats = ({ stats }: SupplierStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          color={stat.color}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}