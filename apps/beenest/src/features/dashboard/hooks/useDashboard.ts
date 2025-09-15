import { useEffect, useState } from 'react'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  lowStockItems: number
  monthlyRevenue: { month: string; revenue: number }[]
  recentOrders: {
    id: string
    customerName: string
    amount: number
    status: 'pending' | 'completed' | 'cancelled'
    date: string
  }[]
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Mock data - 실제 환경에서는 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockData: DashboardMetrics = {
          totalRevenue: 15420000,
          totalOrders: 156,
          totalCustomers: 89,
          lowStockItems: 12,
          monthlyRevenue: [
            { month: '1월', revenue: 8200000 },
            { month: '2월', revenue: 9100000 },
            { month: '3월', revenue: 11200000 },
            { month: '4월', revenue: 13400000 },
            { month: '5월', revenue: 12800000 },
            { month: '6월', revenue: 15420000 },
          ],
          recentOrders: [
            {
              id: 'ORD-001',
              customerName: '주식회사 ABC',
              amount: 1200000,
              status: 'completed',
              date: '2024-06-15'
            },
            {
              id: 'ORD-002',
              customerName: '(주)XYZ마트',
              amount: 850000,
              status: 'pending',
              date: '2024-06-14'
            },
            {
              id: 'ORD-003',
              customerName: '델리온마켓',
              amount: 2100000,
              status: 'completed',
              date: '2024-06-13'
            }
          ]
        }

        setMetrics(mockData)
      } catch (err) {
        setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.')
        console.error('Dashboard fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const refreshMetrics = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // 실제 API 재호출 로직
    } catch (err) {
      setError('데이터 새로고침에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics,
  }
}