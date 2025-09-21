import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { categoriesService } from '@/services/categories.service'
import { handleApiSuccess, handleApiError } from '@/lib/toast'

// 카테고리 목록 조회
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesService.getCategories(),
    enabled: true,
  })
}

// 활성 카테고리 목록 (드롭다운 등에서 사용)
export function useActiveCategories() {
  return useQuery({
    queryKey: queryKeys.categories.active(),
    queryFn: () => categoriesService.getActiveCategories(),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 카테고리 트리 구조
export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: () => categoriesService.getCategoryTree(),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 카테고리 상세 조회
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesService.getCategory(id),
    enabled: !!id,
  })
}

// 카테고리 생성 뮤테이션
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      categoryName: string
      parentCategoryId?: string
      displayOrder?: number
    }) => categoriesService.createCategory(data),
    onSuccess: () => {
      handleApiSuccess('카테고리가 성공적으로 등록되었습니다.')
      // 카테고리 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 카테고리 수정 뮤테이션
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string
      data: {
        categoryName?: string
        parentCategoryId?: string
        displayOrder?: number
        isActive?: boolean
      }
    }) => categoriesService.updateCategory(id, data),
    onSuccess: () => {
      handleApiSuccess('카테고리가 성공적으로 수정되었습니다.')
      // 카테고리 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

// 카테고리 삭제 뮤테이션
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      handleApiSuccess('카테고리가 성공적으로 삭제되었습니다.')
      // 카테고리 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}