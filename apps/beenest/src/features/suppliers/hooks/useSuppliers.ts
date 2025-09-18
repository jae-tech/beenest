import { useState, useMemo } from 'react'
import { useSuppliers as useAPISuppliers, useSupplierActions } from '@/hooks/useSuppliers'
import type { Supplier, SupplierStats } from '@/types'
import type { Supplier as APISupplier } from '@/types/api'

// API Supplier를 앱 Supplier 타입으로 변환
function transformAPISupplierToSupplier(apiSupplier: APISupplier): Supplier {
  return {
    id: apiSupplier.id,
    name: apiSupplier.name,
    contact: apiSupplier.contact || '',
    email: apiSupplier.email || '',
    phone: apiSupplier.phone || '',
    location: apiSupplier.location || '',
    address: '', // API에 address 필드가 없으면 빈 문자열
    products: 0, // 실제 API에서 관련 상품 수를 가져와야 함
    orders: 0, // 실제 API에서 주문 수를 가져와야 함
    rating: apiSupplier.rating || 0,
    status: apiSupplier.status as 'active' | 'pending' | 'inactive',
    createdAt: apiSupplier.createdAt,
    updatedAt: apiSupplier.updatedAt
  }
}

export const useSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // API 호출
  const {
    data: suppliersResponse,
    isLoading: isLoadingSuppliers,
    error: suppliersError
  } = useAPISuppliers({ search: searchTerm })

  const { createSupplier, updateSupplier, deleteSupplier, isLoading: isActionLoading } = useSupplierActions()

  // API 데이터를 앱 타입으로 변환
  const suppliers = useMemo(() => {
    if (!suppliersResponse?.success || !suppliersResponse.data) {
      return []
    }
    return suppliersResponse.data.map(transformAPISupplierToSupplier)
  }, [suppliersResponse])

  // 통계 계산 (실제로는 별도 API에서 가져와야 함)
  const stats: SupplierStats = useMemo(() => {
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length
    const totalOrders = suppliers.reduce((sum, s) => sum + s.orders, 0)
    const totalRating = suppliers.reduce((sum, s) => sum + s.rating, 0)

    return {
      totalSuppliers: suppliers.length,
      activeSuppliers,
      pendingOrders: 0, // 실제 API에서 가져와야 함
      avgRating: suppliers.length > 0 ? totalRating / suppliers.length : 0
    }
  }, [suppliers])

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createSupplier.mutateAsync({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone,
        location: supplier.location,
        status: supplier.status,
        rating: supplier.rating
      })
    } catch (error) {
      throw error
    }
  }

  const updateSupplierData = async (id: string, updates: Partial<Supplier>) => {
    try {
      await updateSupplier.mutateAsync({
        id,
        data: {
          name: updates.name,
          contact: updates.contact,
          email: updates.email,
          phone: updates.phone,
          location: updates.location,
          status: updates.status,
          rating: updates.rating
        }
      })
    } catch (error) {
      throw error
    }
  }

  const deleteSupplierData = async (id: string) => {
    try {
      await deleteSupplier.mutateAsync(id)
    } catch (error) {
      throw error
    }
  }

  return {
    stats,
    suppliers: filteredSuppliers,
    searchTerm,
    setSearchTerm,
    isLoading: isLoadingSuppliers || isActionLoading,
    error: suppliersError ? '공급업체 데이터를 불러오는데 실패했습니다.' : null,
    addSupplier,
    updateSupplier: updateSupplierData,
    deleteSupplier: deleteSupplierData
  }
}