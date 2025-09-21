import { BaseSearchParams } from './common'
import { Order, OrderItem, OrderStats } from '../entities/order'
import { OrderStatus } from '../enums/status'

// 주문 검색 파라미터
export interface OrdersSearchParams extends BaseSearchParams {
  status?: OrderStatus
  supplierId?: string
  startDate?: string
  endDate?: string
}

// 주문 생성 요청
export interface CreateOrderRequest {
  supplierId: string
  orderDate: string
  expectedDeliveryDate?: string
  notes?: string
  orderItems: CreateOrderItemRequest[]
}

// 주문 아이템 생성 요청
export interface CreateOrderItemRequest {
  productId: string
  quantity: number
  unitPrice: number
}

// 주문 수정 요청
export interface UpdateOrderRequest extends Partial<Omit<CreateOrderRequest, 'orderItems'>> {
  orderItems?: UpdateOrderItemRequest[]
}

// 주문 아이템 수정 요청
export interface UpdateOrderItemRequest extends Partial<CreateOrderItemRequest> {
  id?: string
}

// 주문 상태 변경 요청
export interface UpdateOrderStatusRequest {
  status: OrderStatus
  actualDeliveryDate?: string
  notes?: string
}

// 주문 통계 응답
export interface OrdersStatsResponse extends OrderStats {}