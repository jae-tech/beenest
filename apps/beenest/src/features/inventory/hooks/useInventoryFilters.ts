import { useInventoryStore } from '../stores/inventoryStore'
import { useMemo } from 'react'
import type { InventoryFilters, SelectOption } from '@/shared/types'

export function useInventoryFilters() {
  const {
    filters,
    searchQuery,
    items,
    setFilters,
    resetFilters,
    setSearchQuery,
  } = useInventoryStore()

  // Get unique categories from items
  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = [...new Set(items.map(item => item.product.category))]
    return [
      { value: '', label: '모든 카테고리' },
      ...categories.map(category => ({
        value: category,
        label: category,
      })),
    ]
  }, [items])

  // Get unique suppliers from items
  const supplierOptions: SelectOption[] = useMemo(() => {
    const suppliers = [...new Set(items.map(item => item.product.supplier?.id).filter(Boolean))]
    return [
      { value: '', label: '모든 거래처' },
      ...suppliers.map(supplierId => {
        const supplier = items.find(item => item.product.supplier?.id === supplierId)?.product.supplier
        return {
          value: supplierId!,
          label: supplier?.name || '알 수 없음',
        }
      }),
    ]
  }, [items])

  const statusOptions: SelectOption[] = [
    { value: 'all', label: '모든 상태' },
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
    { value: 'discontinued', label: '단종' },
  ]

  // Filter actions
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setFilters({ category })
  }

  const handleStatusChange = (status: InventoryFilters['status']) => {
    setFilters({ status })
  }

  const handleSupplierChange = (supplierId: string) => {
    setFilters({ supplierId: supplierId || undefined })
  }

  const handleLowStockToggle = (lowStock: boolean) => {
    setFilters({ lowStock })
  }

  const handleBulkFilters = (newFilters: Partial<InventoryFilters>) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    resetFilters()
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.category !== '' ||
      filters.status !== 'all' ||
      filters.lowStock ||
      filters.supplierId !== undefined
    )
  }, [filters])

  return {
    // Current filters
    filters,
    searchQuery,

    // Options
    categoryOptions,
    supplierOptions,
    statusOptions,

    // State
    hasActiveFilters,

    // Actions
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleSupplierChange,
    handleLowStockToggle,
    handleBulkFilters,
    clearAllFilters,
  }
}