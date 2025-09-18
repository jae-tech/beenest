import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type LucideIcon, Package, DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { queryKeys } from '@/lib/query-client'
import { dashboardService } from '@/services/dashboard.service'

export interface DashboardMetric {
  icon: LucideIcon
  title: string
  value: string
  change: string
  color: string
  trend: 'up' | 'down'
}

export interface SalesItem {
  name: string
  sku: string
  orderId: string
  price: string
  status: string
  statusColor: string
}

export interface NewStockItem {
  sku: string
  name: string
  qty: number
  price: string
}

export interface DashboardData {
  metrics: DashboardMetric[]
  salesData: SalesItem[]
  newStock: NewStockItem[]
  monthlyRevenue: { month: string; revenue: number }[]
}

export const useDashboard = () => {
  // 대시보드 통계 조회
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 새로고침
  })

  // 차트 데이터 조회
  const {
    data: chartsResponse,
    isLoading: isChartsLoading,
    error: chartsError
  } = useQuery({
    queryKey: queryKeys.dashboard.charts(),
    queryFn: () => dashboardService.getCharts(),
    refetchInterval: 5 * 60 * 1000,
  })

  // 알림 데이터 조회
  const {
    data: alertsResponse,
    isLoading: isAlertsLoading
  } = useQuery({
    queryKey: queryKeys.dashboard.alerts(),
    queryFn: () => dashboardService.getAlerts(),
    refetchInterval: 2 * 60 * 1000, // 2분마다 알림 체크
  })

  // API 데이터를 UI 형태로 변환
  const metrics = useMemo((): DashboardMetric[] => {
    if (!statsResponse?.success || !statsResponse.data) {
      return []
    }

    const stats = statsResponse.data
    const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num)
    const formatCurrency = (num: number) => `₩${formatNumber(num)}`

    return [
      {
        icon: Package,
        title: "총 상품 수",
        value: `${formatNumber(stats.totalProducts)} 개`,
        change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month`,
        color: "bg-green-500",
        trend: stats.revenueGrowth >= 0 ? "up" : "down"
      },
      {
        icon: DollarSign,
        title: "총 매출",
        value: formatCurrency(stats.totalRevenue),
        change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month`,
        color: "bg-yellow-500",
        trend: stats.revenueGrowth >= 0 ? "up" : "down"
      },
      {
        icon: ShoppingCart,
        title: "총 주문 수",
        value: formatNumber(stats.totalOrders),
        change: `${stats.ordersGrowth > 0 ? '+' : ''}${stats.ordersGrowth}% from last month`,
        color: "bg-blue-500",
        trend: stats.ordersGrowth >= 0 ? "up" : "down"
      },
      {
        icon: Users,
        title: "공급업체 수",
        value: formatNumber(stats.totalSuppliers),
        change: "활성 공급업체",
        color: "bg-purple-500",
        trend: "up"
      },
      {
        icon: TrendingUp,
        title: "재고 부족 상품",
        value: formatNumber(stats.lowStockProducts),
        change: "주의 필요",
        color: stats.lowStockProducts > 0 ? "bg-red-500" : "bg-green-500",
        trend: stats.lowStockProducts > 0 ? "down" : "up"
      }
    ]
  }, [statsResponse])

  const monthlyRevenue = useMemo(() => {
    if (!chartsResponse?.success || !chartsResponse.data) {
      return []
    }

    const chartData = chartsResponse.data
    return chartData.labels.map((label, index) => ({
      month: label,
      revenue: chartData.revenue[index] || 0
    }))
  }, [chartsResponse])

  // Mock 데이터 (실제 API가 없는 경우)
  const salesData: SalesItem[] = [
    {
      name: "백팩",
      sku: "25 재고",
      orderId: "#ORD100",
      price: "₩200,000",
      status: "완료",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      name: "티셔츠",
      sku: "25 재고",
      orderId: "#ORD200",
      price: "₩89,000",
      status: "진행중",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "선글라스",
      sku: "15 재고",
      orderId: "#ORD300",
      price: "₩150,000",
      status: "대기",
      statusColor: "bg-gray-100 text-gray-800"
    }
  ]

  const newStock: NewStockItem[] = [
    { sku: "SKU-300", name: "헤드폰", qty: 200, price: "₩400,000" },
    { sku: "SKU-301", name: "물병", qty: 240, price: "₩600,000" },
    { sku: "SKU-302", name: "헬멧", qty: 500, price: "₩1,200,000" },
    { sku: "SKU-303", name: "신발", qty: 100, price: "₩300,000" }
  ]

  const refreshMetrics = async () => {
    try {
      await refetchStats()
    } catch (err) {
      console.error('Failed to refresh metrics:', err)
    }
  }

  return {
    metrics,
    salesData,
    newStock,
    monthlyRevenue,
    isLoading: isStatsLoading || isChartsLoading || isAlertsLoading,
    error: statsError || chartsError ? '데이터를 불러오는데 실패했습니다.' : null,
    refreshMetrics,
    alerts: alertsResponse?.data || []
  }
}