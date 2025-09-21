import { OrderStatus } from '../enums/status'
import { Product } from './product'
import { Supplier } from './supplier'

// 주문 아이템
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

// 주문 엔티티
export interface Order {
  id: string
  orderNumber: string
  supplierId: string
  status: OrderStatus
  orderDate: string
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  totalAmount: number
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  supplier?: Supplier
  orderItems?: OrderItem[]
}

// 주문 통계
export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalValue: number
  averageOrderValue: number
}