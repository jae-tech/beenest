import { api } from '@/lib/api-client'
import type { Inventory, StockMovement, LowStockAlert, InventoryByProduct, InventoryStats } from '@beenest/types'
import type {
  AdjustStockRequest,
  UpdateInventoryRequest,
  PaginatedResponse
} from '@/types/api'

export const inventoryService = {
  // 재고 조정
  async adjustStock(productId: string, data: AdjustStockRequest): Promise<any> {
    return api.post<any>(`/inventory/products/${productId}/adjust`, data)
  },

  // 재고 설정 업데이트
  async updateInventorySettings(productId: string, data: UpdateInventoryRequest): Promise<any> {
    return api.patch<any>(`/inventory/products/${productId}/settings`, data)
  },

  // 상품별 재고 현황 조회
  async getInventoryByProduct(productId: string): Promise<InventoryByProduct> {
    return api.get<InventoryByProduct>(`/inventory/products/${productId}`)
  },

  // 재고 부족 알림 조회
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    return api.get<LowStockAlert[]>('/inventory/alerts/low-stock')
  },

  // 상품별 재고 이동 이력 조회
  async getStockMovements(productId: string, page = 1, limit = 20): Promise<{
    data: StockMovement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return api.get<{
      data: StockMovement[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/inventory/products/${productId}/movements`, {
      page,
      limit
    })
  },

  // 재고 통계 조회
  async getInventoryStats(): Promise<InventoryStats> {
    return api.get<InventoryStats>('/inventory/stats')
  },

  // 전체 재고 이동 이력 조회 (모든 상품)
  async getAllStockMovements(params?: {
    page?: number
    limit?: number
    productId?: string
  }): Promise<{
    data: StockMovement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return api.get<{
      data: StockMovement[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/inventory/movements', params)
  }
}