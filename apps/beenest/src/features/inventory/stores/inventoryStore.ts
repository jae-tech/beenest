import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { InventoryItem, InventoryFilters, PaginationState, Status } from '@/shared/types'

interface InventoryState {
  // Data
  items: InventoryItem[]
  selectedItems: string[]

  // Filters and Search
  filters: InventoryFilters
  searchQuery: string

  // Pagination
  pagination: PaginationState

  // UI State
  status: Status
  error: string | null
  isLoading: boolean

  // View Options
  viewMode: 'grid' | 'list'
  sortBy: 'name' | 'quantity' | 'lastUpdated' | 'category'
  sortOrder: 'asc' | 'desc'

  // Actions
  setItems: (items: InventoryItem[]) => void
  addItem: (item: InventoryItem) => void
  updateItem: (id: string, updates: Partial<InventoryItem>) => void
  removeItem: (id: string) => void

  // Selection
  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  selectAllItems: () => void
  deselectAllItems: () => void

  // Filters
  setFilters: (filters: Partial<InventoryFilters>) => void
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
  setViewMode: (mode: 'grid' | 'list') => void
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void

  // Bulk Actions
  bulkUpdateItems: (ids: string[], updates: Partial<InventoryItem>) => void
  bulkDeleteItems: (ids: string[]) => void
}

const initialFilters: InventoryFilters = {
  search: '',
  category: '',
  status: 'all',
  lowStock: false,
  supplierId: undefined,
}

const initialPagination: PaginationState = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
}

export const useInventoryStore = create<InventoryState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      items: [],
      selectedItems: [],
      filters: initialFilters,
      searchQuery: '',
      pagination: initialPagination,
      status: 'idle',
      error: null,
      isLoading: false,
      viewMode: 'list',
      sortBy: 'name',
      sortOrder: 'asc',

      // Data actions
      setItems: (items: InventoryItem[]) => {
        set((state) => {
          state.items = items
          state.pagination.total = items.length
          state.pagination.totalPages = Math.ceil(items.length / state.pagination.pageSize)
        })
      },

      addItem: (item: InventoryItem) => {
        set((state) => {
          state.items.push(item)
          state.pagination.total = state.items.length
          state.pagination.totalPages = Math.ceil(state.items.length / state.pagination.pageSize)
        })
      },

      updateItem: (id: string, updates: Partial<InventoryItem>) => {
        set((state) => {
          const index = state.items.findIndex(item => item.id === id)
          if (index !== -1) {
            Object.assign(state.items[index], updates)
          }
        })
      },

      removeItem: (id: string) => {
        set((state) => {
          state.items = state.items.filter(item => item.id !== id)
          state.selectedItems = state.selectedItems.filter(itemId => itemId !== id)
          state.pagination.total = state.items.length
          state.pagination.totalPages = Math.ceil(state.items.length / state.pagination.pageSize)
        })
      },

      // Selection actions
      selectItem: (id: string) => {
        set((state) => {
          if (!state.selectedItems.includes(id)) {
            state.selectedItems.push(id)
          }
        })
      },

      deselectItem: (id: string) => {
        set((state) => {
          state.selectedItems = state.selectedItems.filter(itemId => itemId !== id)
        })
      },

      selectAllItems: () => {
        set((state) => {
          state.selectedItems = state.items.map(item => item.id)
        })
      },

      deselectAllItems: () => {
        set((state) => {
          state.selectedItems = []
        })
      },

      // Filter actions
      setFilters: (filters: Partial<InventoryFilters>) => {
        set((state) => {
          Object.assign(state.filters, filters)
          state.pagination.page = 1 // Reset to first page when filters change
        })
      },

      resetFilters: () => {
        set((state) => {
          state.filters = { ...initialFilters }
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

      setViewMode: (mode: 'grid' | 'list') => {
        set((state) => {
          state.viewMode = mode
        })
      },

      setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
        set((state) => {
          state.sortBy = sortBy as any
          state.sortOrder = sortOrder
        })
      },

      // Bulk actions
      bulkUpdateItems: (ids: string[], updates: Partial<InventoryItem>) => {
        set((state) => {
          ids.forEach(id => {
            const index = state.items.findIndex(item => item.id === id)
            if (index !== -1) {
              Object.assign(state.items[index], updates)
            }
          })
        })
      },

      bulkDeleteItems: (ids: string[]) => {
        set((state) => {
          state.items = state.items.filter(item => !ids.includes(item.id))
          state.selectedItems = state.selectedItems.filter(itemId => !ids.includes(itemId))
          state.pagination.total = state.items.length
          state.pagination.totalPages = Math.ceil(state.items.length / state.pagination.pageSize)
        })
      },
    })),
    { name: 'inventory-store' }
  )
)