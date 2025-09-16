import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

// 쿼리 키 상수들
export const inventoryQueryKeys = {
  all: ['inventory'] as const,
  items: (filters?: { search?: string; category?: string }) =>
    [...inventoryQueryKeys.all, 'items', filters] as const,
  item: (id: string) => [...inventoryQueryKeys.all, 'item', id] as const,
}

// 재고 목록 조회
export const useInventoryItems = (filters?: { search?: string; category?: string }) => {
  return useQuery({
    queryKey: inventoryQueryKeys.items(filters),
    queryFn: () => api.getInventoryItems(filters),
    staleTime: 2 * 60 * 1000, // 2분
  })
}

// 특정 재고 아이템 조회
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: inventoryQueryKeys.item(id),
    queryFn: () => api.getInventoryItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
  })
}