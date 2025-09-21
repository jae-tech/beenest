import { api } from '@/lib/api-client'
import type { DashboardStats, ChartData } from '@/types/api'

export const dashboardService = {
  // 대시보드 통계 조회
  async getStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/dashboard/stats')
  },

  // 차트 데이터 조회
  async getCharts(period?: string): Promise<ChartData> {
    return api.get<ChartData>('/dashboard/charts/inventory', { period })
  },

  // 알림 데이터 조회
  async getAlerts(): Promise<any[]> {
    return api.get<any[]>('/dashboard/alerts')
  },

  // 최근 활동 조회
  async getRecentActivities(): Promise<any[]> {
    return api.get<any[]>('/dashboard/activities')
  }
}