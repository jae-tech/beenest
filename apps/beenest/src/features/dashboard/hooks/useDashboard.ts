import { useState } from 'react'

export interface DashboardMetric {
  icon: string
  title: string
  value: string
  change: string
  color: string
  trend: 'up' | 'down'
}

export interface SalesItem {
  name: string
  sku: string
  orderId: string
  price: string
  status: string
  statusColor: string
}

export interface NewStockItem {
  sku: string
  name: string
  qty: number
  price: string
}

export interface DashboardData {
  metrics: DashboardMetric[]
  salesData: SalesItem[]
  newStock: NewStockItem[]
  monthlyRevenue: { month: string; revenue: number }[]
}

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mockData: DashboardData = {
    metrics: [
      {
        icon: "fas fa-boxes",
        title: "Total Stock",
        value: "23,340 Units",
        change: "+25% from last month",
        color: "bg-green-500",
        trend: "up"
      },
      {
        icon: "fas fa-dollar-sign",
        title: "Total Inventory Value",
        value: "$23,568,470",
        change: "+25% from last month",
        color: "bg-yellow-500",
        trend: "up"
      },
      {
        icon: "fas fa-chart-line",
        title: "Total Sales",
        value: "$15,420,000",
        change: "+18% from last month",
        color: "bg-blue-500",
        trend: "up"
      },
      {
        icon: "fas fa-users",
        title: "New Customers",
        value: "1,245",
        change: "+12% from last month",
        color: "bg-purple-500",
        trend: "up"
      },
      {
        icon: "fas fa-shopping-cart",
        title: "Orders",
        value: "8,240",
        change: "+8% from last month",
        color: "bg-indigo-500",
        trend: "up"
      }
    ],
    salesData: [
      {
        name: "Backpack",
        sku: "25 in stock",
        orderId: "#ORD100",
        price: "₩200,000",
        status: "Completed",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        name: "T-Shirt",
        sku: "25 in stock",
        orderId: "#ORD200",
        price: "₩89,000",
        status: "In Progress",
        statusColor: "bg-yellow-100 text-yellow-800"
      },
      {
        name: "Sunglasses",
        sku: "15 in stock",
        orderId: "#ORD300",
        price: "₩150,000",
        status: "Pending",
        statusColor: "bg-gray-100 text-gray-800"
      }
    ],
    newStock: [
      { sku: "SKU-300", name: "Headphone", qty: 200, price: "₩400,000" },
      { sku: "SKU-301", name: "Bottle", qty: 240, price: "₩600,000" },
      { sku: "SKU-302", name: "Helmet", qty: 500, price: "₩1,200,000" },
      { sku: "SKU-303", name: "Shoes", qty: 100, price: "₩300,000" }
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 48000 },
      { month: "Apr", revenue: 61000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 67000 }
    ]
  }

  const refreshMetrics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // 추후 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000))
      // 성공시 새 데이터 설정
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ...mockData,
    isLoading,
    error,
    refreshMetrics
  }
}