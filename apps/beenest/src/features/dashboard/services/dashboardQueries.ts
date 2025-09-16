import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

// 쿼리 키 상수들
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardQueryKeys.all, 'metrics'] as const,
}

// 대시보드 메트릭 조회
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: dashboardQueryKeys.metrics(),
    queryFn: () => api.getDashboardMetrics(),
    staleTime: 5 * 60 * 1000, // 5분
  })
}