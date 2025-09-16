import { useState } from 'react'

export const useInventoryFilters = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockStatusFilter, setStockStatusFilter] = useState('all')
  const [minStock, setMinStock] = useState('')
  const [maxStock, setMaxStock] = useState('')
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setStockStatusFilter('all')
    setMinStock('')
    setMaxStock('')
    setSortBy('')
    setSortOrder('asc')
  }

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    minStock,
    setMinStock,
    maxStock,
    setMaxStock,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearFilters
  }
}