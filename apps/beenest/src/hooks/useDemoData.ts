import { useState, useEffect, useMemo } from 'react'
import {
  getDemoProducts,
  getDemoSuppliers,
  getDemoCategories,
  getDemoOrders,
  getDemoTransactions,
  addDemoProduct,
  addDemoSupplier,
  addDemoOrder,
  addDemoTransaction,
  updateDemoProduct,
  updateDemoSupplier,
  updateDemoTransaction,
  deleteDemoProduct,
  deleteDemoSupplier,
  deleteDemoTransaction,
} from '@/lib/demo-data'
import type { Product, Supplier, Order } from '@/types/api'

// 데모 상품 데이터 훅
export const useDemoProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProducts = () => {
    setIsLoading(true)
    const data = getDemoProducts()
    setProducts(data)
    setIsLoading(false)
  }

  const createProduct = (productData: Partial<Product>) => {
    const newProduct = addDemoProduct(productData)
    loadProducts()
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = updateDemoProduct(id, updates)
    if (updated) {
      loadProducts()
    }
    return updated
  }

  const deleteProduct = (id: string) => {
    const success = deleteDemoProduct(id)
    if (success) {
      loadProducts()
    }
    return success
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return {
    products,
    isLoading,
    error: null,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: loadProducts,
  }
}

// 데모 공급업체 데이터 훅
export const useDemoSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSuppliers = () => {
    setIsLoading(true)
    const data = getDemoSuppliers()
    setSuppliers(data)
    setIsLoading(false)
  }

  const createSupplier = (supplierData: Partial<Supplier>) => {
    const newSupplier = addDemoSupplier(supplierData)
    loadSuppliers()
    return newSupplier
  }

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    const updated = updateDemoSupplier(id, updates)
    if (updated) {
      loadSuppliers()
    }
    return updated
  }

  const deleteSupplier = (id: string) => {
    const success = deleteDemoSupplier(id)
    if (success) {
      loadSuppliers()
    }
    return success
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  return {
    suppliers,
    isLoading,
    error: null,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: loadSuppliers,
  }
}

// 데모 카테고리 데이터 훅
export const useDemoCategories = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCategories = () => {
    setIsLoading(true)
    const data = getDemoCategories()
    setCategories(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return {
    categories,
    isLoading,
    error: null,
    refetch: loadCategories,
  }
}

// 데모 주문 데이터 훅
export const useDemoOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadOrders = () => {
    setIsLoading(true)
    const data = getDemoOrders()
    setOrders(data)
    setIsLoading(false)
  }

  const createOrder = (orderData: Partial<Order>) => {
    const newOrder = addDemoOrder(orderData)
    loadOrders()
    return newOrder
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return {
    orders,
    isLoading,
    error: null,
    createOrder,
    refetch: loadOrders,
  }
}

// 데모 거래 데이터 훅
export const useDemoTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTransactions = () => {
    setIsLoading(true)
    const data = getDemoTransactions()
    setTransactions(data)
    setIsLoading(false)
  }

  const createTransaction = (transactionData: any) => {
    const newTransaction = addDemoTransaction(transactionData)
    loadTransactions()
    return newTransaction
  }

  const updateTransaction = (id: string, updates: any) => {
    const updated = updateDemoTransaction(id, updates)
    if (updated) {
      loadTransactions()
    }
    return updated
  }

  const deleteTransaction = (id: string) => {
    const success = deleteDemoTransaction(id)
    if (success) {
      loadTransactions()
    }
    return success
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return {
    transactions,
    isLoading,
    error: null,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: loadTransactions,
  }
}

// 거래 통계 계산 훅
export const useDemoTransactionStats = () => {
  const { transactions } = useDemoTransactions()

  const stats = useMemo(() => {
    const purchases = transactions.filter(t => t.type === 'PURCHASE' && t.status === 'COMPLETED')
    const sales = transactions.filter(t => t.type === 'SALE' && t.status === 'COMPLETED')

    // 총 매입액
    const totalPurchases = purchases.reduce((sum, t) => sum + (t.totalAmount || 0), 0)

    // 총 매출액
    const totalSales = sales.reduce((sum, t) => sum + (t.totalAmount || 0), 0)

    // 총 이익
    const totalProfit = totalSales - totalPurchases

    // 이번 달 통계
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const thisMonthSales = sales
      .filter(t => {
        const txnDate = new Date(t.transactionDate)
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0)

    const thisMonthPurchases = purchases
      .filter(t => {
        const txnDate = new Date(t.transactionDate)
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0)

    // 대기 중인 거래
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length

    return {
      totalPurchases,
      totalSales,
      totalProfit,
      thisMonthSales,
      thisMonthPurchases,
      pendingTransactions,
      totalTransactions: transactions.length,
      // 이익률
      profitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0,
      // 월별 성장률 (간단 계산)
      monthlyGrowthRate: 15.5, // 데모용 고정값
    }
  }, [transactions])

  return {
    stats,
    isLoading: false,
    error: null,
  }
}

// 통합 대시보드 통계 계산
export const useDemoDashboardStats = () => {
  const { products } = useDemoProducts()
  const { suppliers } = useDemoSuppliers()
  const { orders } = useDemoOrders()

  const stats = {
    totalProducts: products.length,
    totalSuppliers: suppliers.length,
    totalOrders: orders.length,
    totalInventoryValue: products.reduce((sum, product) => {
      const stock = product.inventory?.currentStock || 0
      const price = product.costPrice || product.unitPrice || 0
      return sum + (stock * price)
    }, 0),
    lowStockProducts: products.filter(product => {
      const stock = product.inventory?.currentStock || 0
      const minStock = product.inventory?.minimumStock || 0
      return stock <= minStock
    }).length,
    pendingOrders: orders.filter(order => order.status === 'PENDING').length,
  }

  // 월별 매출 데이터 생성 (최근 6개월)
  const monthlyRevenue = useMemo(() => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('ko-KR', { month: 'short' })

      // 각 월별로 랜덤한 매출 생성 (실제로는 주문 데이터에서 계산해야 함)
      const baseRevenue = 2000000 + (Math.random() * 1000000) // 200만 ~ 300만
      const monthlyVariation = 1 + (Math.sin(i * 0.5) * 0.3) // 월별 변동
      const revenue = Math.floor(baseRevenue * monthlyVariation)

      months.push({
        month: monthName,
        revenue: revenue
      })
    }

    return months
  }, [])

  return {
    stats,
    monthlyRevenue,
    isLoading: false,
    error: null,
  }
}