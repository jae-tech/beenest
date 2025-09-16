import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Order, PaginationState, Status } from '@/types'

interface OrdersFilters {
  search: string
  status: 'all' | 'pending' | 'processing' | 'completed' | 'cancelled'
  supplierId?: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

interface OrdersState {
  // Data
  orders: Order[]
  selectedOrders: string[]
  currentOrder: Order | null

  // Filters and Search
  filters: OrdersFilters
  searchQuery: string

  // Pagination
  pagination: PaginationState

  // UI State
  status: Status
  error: string | null
  isLoading: boolean

  // View Options
  sortBy: 'orderNumber' | 'totalAmount' | 'status' | 'createdAt'
  sortOrder: 'asc' | 'desc'

  // Actions
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  removeOrder: (id: string) => void
  setCurrentOrder: (order: Order | null) => void

  // Selection
  selectOrder: (id: string) => void
  deselectOrder: (id: string) => void
  selectAllOrders: () => void
  deselectAllOrders: () => void

  // Filters
  setFilters: (filters: Partial<OrdersFilters>) => void
  resetFilters: () => void
  setSearchQuery: (query: string) => void

  // Pagination
  setPagination: (pagination: Partial<PaginationState>) => void
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void

  // UI
  setStatus: (status: Status) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void

  // Order Management
  updateOrderStatus: (id: string, status: Order['status']) => void
  cancelOrder: (id: string, reason?: string) => void
  completeOrder: (id: string) => void

  // Bulk Actions
  bulkUpdateOrders: (ids: string[], updates: Partial<Order>) => void
  bulkCancelOrders: (ids: string[], reason?: string) => void
}

const initialFilters: OrdersFilters = {
  search: '',
  status: 'all',
  supplierId: undefined,
  dateRange: {
    from: null,
    to: null,
  },
}

const initialPagination: PaginationState = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

export const useOrdersStore = create<OrdersState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      orders: [],
      selectedOrders: [],
      currentOrder: null,
      filters: initialFilters,
      searchQuery: '',
      pagination: initialPagination,
      status: 'idle',
      error: null,
      isLoading: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',

      // Data actions
      setOrders: (orders: Order[]) => {
        set((state) => {
          state.orders = orders
          state.pagination.totalItems = orders.length
          state.pagination.totalPages = Math.ceil(orders.length / state.pagination.pageSize)
        })
      },

      addOrder: (order: Order) => {
        set((state) => {
          state.orders.push(order)
          state.pagination.totalItems = state.orders.length
          state.pagination.totalPages = Math.ceil(state.orders.length / state.pagination.pageSize)
        })
      },

      updateOrder: (id: string, updates: Partial<Order>) => {
        set((state) => {
          const index = state.orders.findIndex(order => order.id === id)
          if (index !== -1) {
            Object.assign(state.orders[index], updates, {
              updatedAt: new Date()
            })
          }
        })
      },

      removeOrder: (id: string) => {
        set((state) => {
          state.orders = state.orders.filter(order => order.id !== id)
          state.selectedOrders = state.selectedOrders.filter(orderId => orderId !== id)
          if (state.currentOrder?.id === id) {
            state.currentOrder = null
          }
          state.pagination.totalItems = state.orders.length
          state.pagination.totalPages = Math.ceil(state.orders.length / state.pagination.pageSize)
        })
      },

      setCurrentOrder: (order: Order | null) => {
        set((state) => {
          state.currentOrder = order
        })
      },

      // Selection actions
      selectOrder: (id: string) => {
        set((state) => {
          if (!state.selectedOrders.includes(id)) {
            state.selectedOrders.push(id)
          }
        })
      },

      deselectOrder: (id: string) => {
        set((state) => {
          state.selectedOrders = state.selectedOrders.filter(orderId => orderId !== id)
        })
      },

      selectAllOrders: () => {
        set((state) => {
          state.selectedOrders = state.orders.map(order => order.id)
        })
      },

      deselectAllOrders: () => {
        set((state) => {
          state.selectedOrders = []
        })
      },

      // Filter actions
      setFilters: (filters: Partial<OrdersFilters>) => {
        set((state) => {
          Object.assign(state.filters, filters)
          state.pagination.page = 1
        })
      },

      resetFilters: () => {
        set((state) => {
          state.filters = {
            ...initialFilters,
            dateRange: { from: null, to: null }
          }
          state.searchQuery = ''
          state.pagination.page = 1
        })
      },

      setSearchQuery: (query: string) => {
        set((state) => {
          state.searchQuery = query
          state.filters.search = query
          state.pagination.page = 1
        })
      },

      // Pagination actions
      setPagination: (pagination: Partial<PaginationState>) => {
        set((state) => {
          Object.assign(state.pagination, pagination)
        })
      },

      nextPage: () => {
        set((state) => {
          if (state.pagination.page < state.pagination.totalPages) {
            state.pagination.page += 1
          }
        })
      },

      previousPage: () => {
        set((state) => {
          if (state.pagination.page > 1) {
            state.pagination.page -= 1
          }
        })
      },

      goToPage: (page: number) => {
        set((state) => {
          if (page >= 1 && page <= state.pagination.totalPages) {
            state.pagination.page = page
          }
        })
      },

      // UI actions
      setStatus: (status: Status) => {
        set((state) => {
          state.status = status
        })
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
        set((state) => {
          state.sortBy = sortBy as any
          state.sortOrder = sortOrder
        })
      },

      // Order Management
      updateOrderStatus: (id: string, status: Order['status']) => {
        set((state) => {
          const index = state.orders.findIndex(order => order.id === id)
          if (index !== -1) {
            state.orders[index].status = status
            state.orders[index].updatedAt = new Date().toISOString()
          }
        })
      },

      cancelOrder: (id: string, reason?: string) => {
        set((state) => {
          const index = state.orders.findIndex(order => order.id === id)
          if (index !== -1) {
            state.orders[index].status = 'cancelled'
            state.orders[index].updatedAt = new Date().toISOString()
            if (reason) {
              state.orders[index].notes = (state.orders[index].notes || '') + `\n취소 사유: ${reason}`
            }
          }
        })
      },

      completeOrder: (id: string) => {
        set((state) => {
          const index = state.orders.findIndex(order => order.id === id)
          if (index !== -1) {
            state.orders[index].status = 'completed'
            state.orders[index].updatedAt = new Date().toISOString()
          }
        })
      },

      // Bulk actions
      bulkUpdateOrders: (ids: string[], updates: Partial<Order>) => {
        set((state) => {
          ids.forEach(id => {
            const index = state.orders.findIndex(order => order.id === id)
            if (index !== -1) {
              Object.assign(state.orders[index], updates, {
                updatedAt: new Date()
              })
            }
          })
        })
      },

      bulkCancelOrders: (ids: string[], reason?: string) => {
        set((state) => {
          ids.forEach(id => {
            const index = state.orders.findIndex(order => order.id === id)
            if (index !== -1) {
              state.orders[index].status = 'cancelled'
              state.orders[index].updatedAt = new Date().toISOString()
              if (reason) {
                state.orders[index].notes = (state.orders[index].notes || '') + `\n취소 사유: ${reason}`
              }
            }
          })
        })
      },
    })),
    { name: 'orders-store' }
  )
)