import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suppliersService } from '@/services/suppliers.service'
import type { SuppliersSearchParams, Supplier } from '@/types/api'
import { queryKeys } from '@/lib/query-client'

export const useSuppliers = (params?: SuppliersSearchParams) => {
  return useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => suppliersService.getSuppliers(params),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => suppliersService.getSupplier(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupplierStats = () => {
  return useQuery({
    queryKey: queryKeys.suppliers.stats('all'),
    queryFn: () => suppliersService.getAllSupplierStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: suppliersService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      suppliersService.updateSupplier(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: suppliersService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() })
    },
  })
}