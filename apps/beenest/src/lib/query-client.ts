import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// 쿼리 키 팩토리
export const queryKeys = {
  // 인증
  auth: {
    me: ['auth', 'me'] as const,
  },

  // 상품
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: any) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    lowStock: () => [...queryKeys.products.all, 'low-stock'] as const,
  },

  // 공급업체
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: (params?: any) => [...queryKeys.suppliers.lists(), params] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.suppliers.details(), id] as const,
    stats: (id: string) => [...queryKeys.suppliers.detail(id), 'stats'] as const,
  },

  // 주문
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (params?: any) => [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // 대시보드
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    charts: () => [...queryKeys.dashboard.all, 'charts'] as const,
    alerts: () => [...queryKeys.dashboard.all, 'alerts'] as const,
  },

  // 재고 이동
  stockMovements: {
    all: ['stock-movements'] as const,
    lists: () => [...queryKeys.stockMovements.all, 'list'] as const,
    list: (productId?: string) => [...queryKeys.stockMovements.lists(), productId] as const,
  },

  // 재고 관리
  inventory: {
    all: ['inventory'] as const,
    stats: () => [...queryKeys.inventory.all, 'stats'] as const,
    product: (productId: string) => [...queryKeys.inventory.all, 'product', productId] as const,
    movements: (productId: string) => [...queryKeys.inventory.all, 'movements', productId] as const,
    alerts: () => [...queryKeys.inventory.all, 'alerts'] as const,
  },

  // 카테고리
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (params?: any) => [...queryKeys.categories.lists(), params] as const,
    active: () => [...queryKeys.categories.all, 'active'] as const,
    tree: () => [...queryKeys.categories.all, 'tree'] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
} as const