import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { inventoryService } from '@/services/inventory.service'
import { handleApiError, handleApiSuccess } from '@/lib/toast'
import type { Inventory, StockMovement } from '@beenest/types'
import type {
  AdjustStockRequest,
  UpdateInventoryRequest
} from '@/types/api'

// 재고 통계 조회
export function useInventoryStats() {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'stats'],
    queryFn: () => inventoryService.getInventoryStats(),
  })
}

// 상품별 재고 현황 조회
export function useInventoryByProduct(productId: string) {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'product', productId],
    queryFn: () => inventoryService.getInventoryByProduct(productId),
    enabled: !!productId,
  })
}

// 재고 부족 알림 조회
export function useLowStockAlerts() {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'low-stock-alerts'],
    queryFn: () => inventoryService.getLowStockAlerts(),
  })
}

// 상품별 재고 이동 이력 조회
export function useStockMovements(productId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'movements', productId, { page, limit }],
    queryFn: () => inventoryService.getStockMovements(productId, page, limit),
    enabled: !!productId,
  })
}

// 전체 재고 이동 이력 조회
export function useAllStockMovements(params?: {
  page?: number
  limit?: number
  productId?: string
}) {
  return useQuery({
    queryKey: [...queryKeys.inventory.all, 'all-movements', params],
    queryFn: () => inventoryService.getAllStockMovements(params),
  })
}

// 재고 조정 뮤테이션
export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: AdjustStockRequest }) =>
      inventoryService.adjustStock(productId, data),
    onSuccess: (response, variables) => {
      handleApiSuccess('재고가 성공적으로 조정되었습니다.')

      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: [...queryKeys.inventory.all] })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })

      // 특정 상품의 재고 정보 무효화
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.inventory.all, 'product', variables.productId]
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.inventory.all, 'movements', variables.productId]
      })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 재고 설정 업데이트 뮤테이션
export function useUpdateInventorySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateInventoryRequest }) =>
      inventoryService.updateInventorySettings(productId, data),
    onSuccess: (response, variables) => {
      handleApiSuccess('재고 설정이 성공적으로 업데이트되었습니다.')

      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: [...queryKeys.inventory.all] })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })

      // 특정 상품의 재고 정보 무효화
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.inventory.all, 'product', variables.productId]
      })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 재고 관리 유틸리티 훅
export function useInventoryActions() {
  const adjustStock = useAdjustStock()
  const updateSettings = useUpdateInventorySettings()

  return {
    adjustStock,
    updateSettings,
    isLoading: adjustStock.isPending || updateSettings.isPending,
  }
}