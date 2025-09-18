import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { dashboardService } from '@/services/dashboard.service'

// 대시보드 전체 통계
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 재고 차트 데이터
export function useInventoryChart() {
  return useQuery({
    queryKey: queryKeys.dashboard.charts.inventory(),
    queryFn: () => dashboardService.getInventoryChart(),
    staleTime: 10 * 60 * 1000, // 10분
  })
}

// 재고 이동 차트 데이터
export function useStockMovementChart() {
  return useQuery({
    queryKey: queryKeys.dashboard.charts.stockMovement(),
    queryFn: () => dashboardService.getStockMovementChart(),
    staleTime: 10 * 60 * 1000, // 10분
  })
}

// 대시보드 알림
export function useDashboardAlerts() {
  return useQuery({
    queryKey: queryKeys.dashboard.alerts(),
    queryFn: () => dashboardService.getAlerts(),
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
  })
}

// 대시보드 전체 데이터 (통합)
export function useDashboard() {
  const stats = useDashboardStats()
  const inventoryChart = useInventoryChart()
  const stockMovementChart = useStockMovementChart()
  const alerts = useDashboardAlerts()

  return {
    stats,
    inventoryChart,
    stockMovementChart,
    alerts,
    isLoading: stats.isLoading || inventoryChart.isLoading || stockMovementChart.isLoading || alerts.isLoading,
    isError: stats.isError || inventoryChart.isError || stockMovementChart.isError || alerts.isError,
    refetchAll: () => {
      stats.refetch()
      inventoryChart.refetch()
      stockMovementChart.refetch()
      alerts.refetch()
    }
  }
}