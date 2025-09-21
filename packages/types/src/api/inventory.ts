import { BaseSearchParams } from './common'
import {
  Inventory,
  StockMovement,
  LowStockAlert,
  InventoryByProduct,
  InventoryStats
} from '../entities/inventory'
import { MovementType } from '../enums/status'

// 재고 검색 파라미터
export interface InventorySearchParams extends BaseSearchParams {
  productId?: string
  warehouseLocation?: string
  lowStock?: boolean
}

// 재고 조정 요청
export interface AdjustStockRequest {
  productId: string
  movementType: MovementType
  quantity: number
  unitCost?: number
  reason?: string
  referenceId?: string
  referenceType?: string
}

// 재고 이동 이력 검색 파라미터
export interface StockMovementsSearchParams extends BaseSearchParams {
  productId?: string
  movementType?: MovementType
  startDate?: string
  endDate?: string
}

// 재고 통계 응답
export interface InventoryStatsResponse extends InventoryStats {}