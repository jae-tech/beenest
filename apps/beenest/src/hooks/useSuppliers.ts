import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { suppliersService } from '@/services/suppliers.service'
import { handleApiSuccess, handleApiError } from '@/lib/toast'
import type {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SuppliersSearchParams
} from '@/types/api'

// 공급업체 목록 조회
export function useSuppliers(params?: SuppliersSearchParams) {
  return useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => suppliersService.getSuppliers(params),
    enabled: true,
  })
}

// 공급업체 상세 조회
export function useSupplier(id: string) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => suppliersService.getSupplier(id),
    enabled: !!id,
  })
}

// 활성 공급업체 목록 (드롭다운 등에서 사용)
export function useActiveSuppliers() {
  return useQuery({
    queryKey: [...queryKeys.suppliers.all, 'active'],
    queryFn: () => suppliersService.getActiveSuppliers(),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 공급업체 검색 (자동완성)
export function useSupplierSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.suppliers.all, 'search', query],
    queryFn: () => suppliersService.searchSuppliers(query),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30초
  })
}

// 공급업체 전체 통계
export function useSupplierStats() {
  return useQuery({
    queryKey: [...queryKeys.suppliers.all, 'stats'],
    queryFn: () => suppliersService.getAllSupplierStats(),
  })
}

// 공급업체별 통계
export function useSupplierStatsById(id: string) {
  return useQuery({
    queryKey: queryKeys.suppliers.stats(id),
    queryFn: () => suppliersService.getSupplierStats(id),
    enabled: !!id,
  })
}

// 공급업체 생성 뮤테이션
export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => suppliersService.createSupplier(data),
    onSuccess: () => {
      handleApiSuccess('공급업체가 성공적으로 등록되었습니다.')
      // 공급업체 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 공급업체 수정 뮤테이션
export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierRequest }) =>
      suppliersService.updateSupplier(id, data),
    onSuccess: (supplier, variables) => {
      handleApiSuccess('공급업체가 성공적으로 수정되었습니다.')
      // 해당 공급업체 상세 쿼리 업데이트
      queryClient.setQueryData(queryKeys.suppliers.detail(variables.id), supplier)
      // 공급업체 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 공급업체 삭제 뮤테이션
export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => suppliersService.deleteSupplier(id),
    onSuccess: (_, id) => {
      handleApiSuccess('공급업체가 성공적으로 삭제되었습니다.')
      // 해당 공급업체 관련 쿼리 제거
      queryClient.removeQueries({ queryKey: queryKeys.suppliers.detail(id) })
      // 공급업체 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 여러 공급업체 작업을 위한 유틸리티 훅
export function useSupplierActions() {
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    isLoading:
      createSupplier.isPending ||
      updateSupplier.isPending ||
      deleteSupplier.isPending,
  }
}