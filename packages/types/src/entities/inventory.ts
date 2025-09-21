import { MovementType, AlertType } from '../enums/status'
import { Product } from './product'

// 재고 엔티티
export interface Inventory {
  id: string
  productId: string
  currentStock: number
  minimumStock: number
  maximumStock?: number
  warehouseLocation?: string
  lastMovementDate?: string
  alertType?: AlertType
  createdAt: string
  updatedAt: string
  product?: Product
}

// 재고 이동 이력
export interface StockMovement {
  id: string
  productId: string
  movementType: MovementType
  quantity: number
  previousStock: number
  newStock: number
  unitCost?: number
  reason?: string
  referenceId?: string
  referenceType?: string
  createdBy: string
  createdAt: string
  product?: Product
}

// 재고 부족 알림
export interface LowStockAlert {
  id: string
  productId: string
  alertType: AlertType
  currentStock: number
  minimumStock: number
  isResolved: boolean
  createdAt: string
  product: Product
  inventory: Inventory
}

// 상품별 재고 정보
export interface InventoryByProduct {
  product: Product
  inventory: Inventory
  recentMovements: StockMovement[]
  alerts: LowStockAlert[]
}

// 재고 통계
export interface InventoryStats {
  totalProducts: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
  totalMovements: number
}