import { useState } from 'react'
import type { Supplier, SupplierStats } from '@/types'

export const useSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data - 기존 코드에서 가져온 데이터
  const stats: SupplierStats = {
    totalSuppliers: 156,
    activeSuppliers: 142,
    pendingOrders: 23,
    avgRating: 4.8
  }

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: "TechSupply Co.",
      contact: "john@techsupply.com",
      email: "john@techsupply.com",
      phone: "+1-555-0123",
      location: "New York, USA",
      address: "123 Tech Street, NY 10001",
      products: 45,
      orders: 128,
      rating: 4.9,
      status: "active",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15"
    },
    {
      id: '2',
      name: "Global Electronics",
      contact: "sarah@globalelec.com",
      email: "sarah@globalelec.com",
      phone: "+44-20-7946-0958",
      location: "London, UK",
      address: "456 Electronics Ave, London EC1A 1BB",
      products: 78,
      orders: 256,
      rating: 4.7,
      status: "active",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-16"
    },
    {
      id: '3',
      name: "Fashion Forward",
      contact: "mike@fashionfw.com",
      email: "mike@fashionfw.com",
      phone: "+33-1-42-86-83-26",
      location: "Paris, France",
      address: "789 Fashion Blvd, Paris 75001",
      products: 123,
      orders: 89,
      rating: 4.8,
      status: "pending",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-17"
    },
    {
      id: '4',
      name: "Sports Gear Ltd",
      contact: "emma@sportsgear.com",
      email: "emma@sportsgear.com",
      phone: "+49-30-12345678",
      location: "Berlin, Germany",
      address: "321 Sports Way, Berlin 10115",
      products: 67,
      orders: 145,
      rating: 4.6,
      status: "active",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-18"
    }
  ]

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Adding supplier:', supplier)
    } catch (err) {
      setError('Failed to add supplier')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updating supplier:', id, updates)
    } catch (err) {
      setError('Failed to update supplier')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSupplier = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Deleting supplier:', id)
    } catch (err) {
      setError('Failed to delete supplier')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    suppliers: filteredSuppliers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier
  }
}