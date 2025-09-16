import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

// 쿼리 키 상수들
export const ordersQueryKeys = {
  all: ['orders'] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...ordersQueryKeys.all, 'list', filters] as const,
}

// 주문 목록 조회
export const useOrders = (filters?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ordersQueryKeys.list(filters),
    queryFn: () => api.getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2분
  })
}