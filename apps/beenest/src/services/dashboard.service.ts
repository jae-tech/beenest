import { api } from '@/lib/api-client'
import type { DashboardStats, ChartData } from '@/types/api'

export const dashboardService = {
  // 대시보드 통계 조회
  async getStats(): Promise<DashboardStats> {
    try {
      return await api.get<DashboardStats>('/dashboard/stats')
    } catch (error) {
      console.warn('API 호출 실패, mock 데이터 반환:', error)
      // API 호출 실패 시 mock 데이터 반환
      return {
        overview: {
          totalProducts: 125,
          totalInventoryValue: 15420000,
          recentOrders: 38,
          totalSuppliers: 12
        },
        inventory: {
          lowStockCount: 3,
          outOfStockCount: 1,
          reorderRequired: 4
        }
      } as DashboardStats
    }
  },

  // 차트 데이터 조회
  async getCharts(period?: string): Promise<ChartData> {
    try {
      return await api.get<ChartData>('/dashboard/charts/inventory', { period })
    } catch (error) {
      console.warn('차트 API 호출 실패, mock 데이터 반환:', error)
      // API 호출 실패 시 mock 데이터 반환
      return {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        revenue: [1200000, 1900000, 3000000, 5000000, 2000000, 3000000]
      } as ChartData
    }
  },

  // 알림 데이터 조회
  async getAlerts(): Promise<any[]> {
    try {
      return await api.get<any[]>('/dashboard/alerts')
    } catch (error) {
      console.warn('알림 API 호출 실패, mock 데이터 반환:', error)
      // API 호출 실패 시 mock 데이터 반환
      return [
        {
          id: '1',
          type: 'low_stock',
          message: '프리미엄 원두커피 재고가 부족합니다',
          createdAt: new Date().toISOString(),
          severity: 'warning'
        },
        {
          id: '2',
          type: 'new_order',
          message: '새로운 주문이 접수되었습니다',
          createdAt: new Date().toISOString(),
          severity: 'info'
        }
      ]
    }
  },

  // 최근 활동 조회
  async getRecentActivities(): Promise<any[]> {
    try {
      return await api.get<any[]>('/dashboard/activities')
    } catch (error) {
      console.warn('활동 API 호출 실패, mock 데이터 반환:', error)
      return []
    }
  }
}