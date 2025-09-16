import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

// 쿼리 키 상수들
export const reportsQueryKeys = {
  all: ['reports'] as const,
  byType: (type: 'sales' | 'inventory' | 'customers' | 'financial') =>
    [...reportsQueryKeys.all, type] as const,
}

// 리포트 조회 (타입별)
export const useReports = (type: 'sales' | 'inventory' | 'customers' | 'financial') => {
  return useQuery({
    queryKey: reportsQueryKeys.byType(type),
    queryFn: () => api.getReports(type),
    staleTime: 10 * 60 * 1000, // 10분 (리포트는 더 오래 캐시)
  })
}