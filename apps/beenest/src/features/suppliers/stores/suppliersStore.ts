import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Supplier, PaginationState, Status } from '@/types'

interface SuppliersFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
  location: string
}

interface SuppliersState {
  // Data
  suppliers: Supplier[]
  selectedSuppliers: string[]

  // Filters and Search
  filters: SuppliersFilters
  searchQuery: string

  // Pagination
  pagination: PaginationState

  // UI State
  status: Status
  error: string | null
  isLoading: boolean

  // View Options
  sortBy: 'name' | 'email' | 'status' | 'createdAt'
  sortOrder: 'asc' | 'desc'

  // Actions
  setSuppliers: (suppliers: Supplier[]) => void
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  removeSupplier: (id: string) => void

  // Selection
  selectSupplier: (id: string) => void
  deselectSupplier: (id: string) => void
  selectAllSuppliers: () => void
  deselectAllSuppliers: () => void

  // Filters
  setFilters: (filters: Partial<SuppliersFilters>) => void
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

  // Bulk Actions
  bulkUpdateSuppliers: (ids: string[], updates: Partial<Supplier>) => void
  bulkDeleteSuppliers: (ids: string[]) => void
}

const initialFilters: SuppliersFilters = {
  search: '',
  status: 'all',
  location: '',
}

const initialPagination: PaginationState = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
}

export const useSuppliersStore = create<SuppliersState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      suppliers: [],
      selectedSuppliers: [],
      filters: initialFilters,
      searchQuery: '',
      pagination: initialPagination,
      status: 'idle',
      error: null,
      isLoading: false,
      sortBy: 'name',
      sortOrder: 'asc',

      // Data actions
      setSuppliers: (suppliers: Supplier[]) => {
        set((state) => {
          state.suppliers = suppliers
          state.pagination.total = suppliers.length
          state.pagination.totalPages = Math.ceil(suppliers.length / state.pagination.pageSize)
        })
      },

      addSupplier: (supplier: Supplier) => {
        set((state) => {
          state.suppliers.push(supplier)
          state.pagination.total = state.suppliers.length
          state.pagination.totalPages = Math.ceil(state.suppliers.length / state.pagination.pageSize)
        })
      },

      updateSupplier: (id: string, updates: Partial<Supplier>) => {
        set((state) => {
          const index = state.suppliers.findIndex(supplier => supplier.id === id)
          if (index !== -1) {
            Object.assign(state.suppliers[index], updates)
          }
        })
      },

      removeSupplier: (id: string) => {
        set((state) => {
          state.suppliers = state.suppliers.filter(supplier => supplier.id !== id)
          state.selectedSuppliers = state.selectedSuppliers.filter(supplierId => supplierId !== id)
          state.pagination.total = state.suppliers.length
          state.pagination.totalPages = Math.ceil(state.suppliers.length / state.pagination.pageSize)
        })
      },

      // Selection actions
      selectSupplier: (id: string) => {
        set((state) => {
          if (!state.selectedSuppliers.includes(id)) {
            state.selectedSuppliers.push(id)
          }
        })
      },

      deselectSupplier: (id: string) => {
        set((state) => {
          state.selectedSuppliers = state.selectedSuppliers.filter(supplierId => supplierId !== id)
        })
      },

      selectAllSuppliers: () => {
        set((state) => {
          state.selectedSuppliers = state.suppliers.map(supplier => supplier.id)
        })
      },

      deselectAllSuppliers: () => {
        set((state) => {
          state.selectedSuppliers = []
        })
      },

      // Filter actions
      setFilters: (filters: Partial<SuppliersFilters>) => {
        set((state) => {
          Object.assign(state.filters, filters)
          state.pagination.page = 1
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

      setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
        set((state) => {
          state.sortBy = sortBy as any
          state.sortOrder = sortOrder
        })
      },

      // Bulk actions
      bulkUpdateSuppliers: (ids: string[], updates: Partial<Supplier>) => {
        set((state) => {
          ids.forEach(id => {
            const index = state.suppliers.findIndex(supplier => supplier.id === id)
            if (index !== -1) {
              Object.assign(state.suppliers[index], updates)
            }
          })
        })
      },

      bulkDeleteSuppliers: (ids: string[]) => {
        set((state) => {
          state.suppliers = state.suppliers.filter(supplier => !ids.includes(supplier.id))
          state.selectedSuppliers = state.selectedSuppliers.filter(supplierId => !ids.includes(supplierId))
          state.pagination.total = state.suppliers.length
          state.pagination.totalPages = Math.ceil(state.suppliers.length / state.pagination.pageSize)
        })
      },
    })),
    { name: 'suppliers-store' }
  )
)