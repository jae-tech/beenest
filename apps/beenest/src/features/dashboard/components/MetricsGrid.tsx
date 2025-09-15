import { DashboardMetrics } from '../hooks/useDashboard'
import { MetricCard } from '@/shared/ui/metric-card/MetricCard'

interface MetricsGridProps {
  metrics: DashboardMetrics
  className?: string
}

export const MetricsGrid = ({ metrics, className = '' }: MetricsGridProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const metricCards = [
    {
      icon: 'fas fa-boxes',
      title: 'Total Stock',
      value: `${formatNumber(metrics.totalCustomers * 340)} Units`,
      change: '+25%',
      trend: 'up' as const,
      color: 'bg-green-500'
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Total Inventory Value',
      value: formatCurrency(metrics.totalRevenue),
      change: '+25%',
      trend: 'up' as const,
      color: 'bg-yellow-500'
    },
    {
      icon: 'fas fa-bullseye',
      title: 'Total Picking Accuracy',
      value: '90%',
      change: '+4%',
      trend: 'up' as const,
      color: 'bg-blue-500'
    },
    {
      icon: 'fas fa-clock',
      title: 'Pending Orders',
      value: formatNumber(metrics.totalOrders),
      change: '+7%',
      trend: 'up' as const,
      color: 'bg-purple-500'
    },
    {
      icon: 'fas fa-exclamation-triangle',
      title: 'Low Stock Items',
      value: `${formatNumber(metrics.lowStockItems)} Units`,
      change: '-10%',
      trend: 'down' as const,
      color: 'bg-red-500'
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className}`}>
      {metricCards.map((metric, index) => (
        <MetricCard
          key={index}
          icon={metric.icon}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          color={metric.color}
        />
      ))}
    </div>
  )
}