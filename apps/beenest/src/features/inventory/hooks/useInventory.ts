import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types/api'

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

// API Product를 InventoryItem으로 변환하는 함수
function transformProductToInventoryItem(product: Product): InventoryItem {
  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return {
        status: "Out of Stock",
        statusColor: "bg-red-100 text-red-800"
      }
    } else if (product.stockQuantity <= product.minStockLevel) {
      return {
        status: "Low Stock",
        statusColor: "bg-yellow-100 text-yellow-800"
      }
    } else {
      return {
        status: "In Stock",
        statusColor: "bg-green-100 text-green-800"
      }
    }
  }

  const { status, statusColor } = getStockStatus()

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category?.name || '기타',
    quantity: product.stockQuantity,
    price: product.price,
    status,
    statusColor,
    lowStockThreshold: product.minStockLevel
  }
}

export const useInventory = (searchParams?: any) => {
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch
  } = useProducts(searchParams)

  // API 데이터를 InventoryItem 형태로 변환
  const items = useMemo(() => {
    if (!productsResponse?.success || !productsResponse.data) {
      return []
    }

    return productsResponse.data.map(transformProductToInventoryItem)
  }, [productsResponse])

  return {
    items,
    isLoading,
    error: error ? '재고 데이터를 불러오는데 실패했습니다.' : null,
    refetch,
    pagination: productsResponse?.pagination
  }
}