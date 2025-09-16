import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

// 쿼리 키 상수들
export const customersQueryKeys = {
  all: ['customers'] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...customersQueryKeys.all, 'list', filters] as const,
}

// 고객 목록 조회
export const useCustomers = (filters?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: customersQueryKeys.list(filters),
    queryFn: () => api.getCustomers(filters),
    staleTime: 5 * 60 * 1000, // 5분
  })
}