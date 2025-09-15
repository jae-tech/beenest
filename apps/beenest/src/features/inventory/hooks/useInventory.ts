import { useInventoryStore } from '../stores/inventoryStore'
import type { InventoryItem, InventoryFilters } from '@/shared/types'

export function useInventory() {
  const {
    items,
    selectedItems,
    filters,
    pagination,
    status,
    error,
    isLoading,
    viewMode,
    sortBy,
    sortOrder,

    // Actions
    setItems,
    addItem,
    updateItem,
    removeItem,

    // Selection
    selectItem,
    deselectItem,
    selectAllItems,
    deselectAllItems,

    // Filters
    setFilters,
    resetFilters,
    setSearchQuery,

    // Pagination
    setPagination,
    nextPage,
    previousPage,
    goToPage,

    // UI
    setStatus,
    setError,
    setLoading,
    setViewMode,
    setSorting,

    // Bulk actions
    bulkUpdateItems,
    bulkDeleteItems,
  } = useInventoryStore()

  // Computed values
  const hasItems = items.length > 0
  const hasSelectedItems = selectedItems.length > 0
  const allItemsSelected = items.length > 0 && selectedItems.length === items.length
  const someItemsSelected = selectedItems.length > 0 && selectedItems.length < items.length

  // Helper functions
  const getSelectedItems = (): InventoryItem[] => {
    return items.filter(item => selectedItems.includes(item.id))
  }

  const toggleSelectAll = () => {
    if (allItemsSelected) {
      deselectAllItems()
    } else {
      selectAllItems()
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: Partial<InventoryFilters>) => {
    setFilters(newFilters)
  }

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSorting(field, newOrder)
  }

  return {
    // Data
    items,
    selectedItems,
    filters,
    pagination,

    // UI State
    status,
    error,
    isLoading,
    viewMode,
    sortBy,
    sortOrder,

    // Computed
    hasItems,
    hasSelectedItems,
    allItemsSelected,
    someItemsSelected,

    // Actions
    setItems,
    addItem,
    updateItem,
    removeItem,

    // Selection
    selectItem,
    deselectItem,
    selectAllItems,
    deselectAllItems,
    toggleSelectAll,
    getSelectedItems,

    // Filters and Search
    setFilters: handleFilterChange,
    resetFilters,
    setSearchQuery: handleSearch,

    // Pagination
    setPagination,
    nextPage,
    previousPage,
    goToPage,

    // UI
    setStatus,
    setError,
    setLoading,
    setViewMode,
    handleSort,

    // Bulk actions
    bulkUpdateItems,
    bulkDeleteItems,
  }
}