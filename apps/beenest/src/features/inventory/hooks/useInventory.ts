import { useState } from 'react'

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  status: string
  statusColor: string
  lowStockThreshold: number
}

export const useInventory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items: InventoryItem[] = [
    {
      id: '1',
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      quantity: 245,
      price: 89.99,
      status: "In Stock",
      statusColor: "bg-green-100 text-green-800",
      lowStockThreshold: 50
    },
    {
      id: '2',
      name: "Gaming Mouse",
      sku: "GM-002",
      category: "Electronics",
      quantity: 89,
      price: 45.50,
      status: "In Stock",
      statusColor: "bg-green-100 text-green-800",
      lowStockThreshold: 30
    },
    {
      id: '3',
      name: "Office Chair",
      sku: "OC-003",
      category: "Furniture",
      quantity: 12,
      price: 199.99,
      status: "Low Stock",
      statusColor: "bg-yellow-100 text-yellow-800",
      lowStockThreshold: 15
    },
    {
      id: '4',
      name: "Smartphone Stand",
      sku: "SS-004",
      category: "Accessories",
      quantity: 156,
      price: 24.99,
      status: "In Stock",
      statusColor: "bg-green-100 text-green-800",
      lowStockThreshold: 20
    },
    {
      id: '5',
      name: "Laptop Bag",
      sku: "LB-005",
      category: "Accessories",
      quantity: 0,
      price: 59.99,
      status: "Out of Stock",
      statusColor: "bg-red-100 text-red-800",
      lowStockThreshold: 10
    }
  ]

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // 추후 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      setError('재고 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    items,
    isLoading,
    error,
    refetch
  }
}