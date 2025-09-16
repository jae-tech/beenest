import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

// 쿼리 키 상수들
export const shipmentQueryKeys = {
  all: ['shipments'] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...shipmentQueryKeys.all, 'list', filters] as const,
}

// 배송 목록 조회
export const useShipments = (filters?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: shipmentQueryKeys.list(filters),
    queryFn: () => api.getShipments(filters),
    staleTime: 2 * 60 * 1000, // 2분
  })
}