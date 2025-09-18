import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService } from '@/services/products.service'
import type { ProductsSearchParams, Product } from '@/types/api'
import { queryKeys } from '@/lib/query-client'

export const useProducts = (params?: ProductsSearchParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export const useAdjustStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, quantity, reason }: { id: string; quantity: number; reason?: string }) =>
      productsService.adjustStock(id, { quantity, reason }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.lowStock(),
    queryFn: () => productsService.getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2분
  })
}