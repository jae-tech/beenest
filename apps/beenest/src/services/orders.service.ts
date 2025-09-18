import { api } from '@/lib/api-client'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrdersSearchParams,
  PaginatedResponse,
  ApiResponse
} from '@/types/api'

export const ordersService = {
  // 주문 목록 조회 (페이징, 검색, 필터)
  async getOrders(params?: OrdersSearchParams): Promise<PaginatedResponse<Order>> {
    return api.get<PaginatedResponse<Order>>('/orders', params)
  },

  // 주문 상세 조회
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return api.get<Order>(`/orders/${id}`)
  },

  // 주문 생성
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return api.post<Order>('/orders', data)
  },

  // 주문 수정
  async updateOrder(id: string, data: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return api.put<Order>(`/orders/${id}`, data)
  },

  // 주문 삭제
  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/orders/${id}`)
  },

  // 주문 통계
  async getOrderStats(): Promise<ApiResponse<any>> {
    return api.get<any>('/orders/stats')
  },

  // 주문 상태 변경
  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return api.patch<Order>(`/orders/${id}`, { status })
  }
}