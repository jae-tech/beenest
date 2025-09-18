import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/services/orders.service'
import type { OrdersSearchParams, Order } from '@/types/api'
import { queryKeys } from '@/lib/query-client'

export const useOrders = (params?: OrdersSearchParams) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersService.getOrders(params),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useOrderStats = () => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, 'stats'],
    queryFn: () => ordersService.getOrderStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ordersService.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}