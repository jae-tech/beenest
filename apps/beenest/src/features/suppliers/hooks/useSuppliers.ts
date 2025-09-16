import { useState } from 'react'

export interface SupplierStat {
  icon: string
  title: string
  value: string
  color: string
  change?: string
  trend?: 'up' | 'down'
}

export interface Supplier {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  category: string
  status: 'Active' | 'Inactive'
  rating: number
  lastOrder: string
}

export const useSuppliers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats: SupplierStat[] = [
    {
      icon: "fas fa-store",
      title: "Total Suppliers",
      value: "125",
      change: "+12% from last month",
      color: "bg-blue-500",
      trend: "up"
    },
    {
      icon: "fas fa-handshake",
      title: "Active Partnerships",
      value: "98",
      change: "+5% from last month",
      color: "bg-green-500",
      trend: "up"
    },
    {
      icon: "fas fa-clock",
      title: "Avg Response Time",
      value: "2.4 days",
      change: "-8% from last month",
      color: "bg-yellow-500",
      trend: "down"
    },
    {
      icon: "fas fa-star",
      title: "Avg Rating",
      value: "4.6/5",
      change: "+0.2 from last month",
      color: "bg-purple-500",
      trend: "up"
    }
  ]

  const suppliers: Supplier[] = [
    {
      id: 1,
      name: "Tech Solutions Ltd",
      contact: "John Smith",
      email: "john@techsolutions.com",
      phone: "+82-2-1234-5678",
      category: "Electronics",
      status: "Active",
      rating: 4.8,
      lastOrder: "2024-01-15"
    },
    {
      id: 2,
      name: "Global Materials Co",
      contact: "Sarah Johnson",
      email: "sarah@globalmaterials.com",
      phone: "+82-2-2345-6789",
      category: "Raw Materials",
      status: "Active",
      rating: 4.5,
      lastOrder: "2024-01-12"
    },
    {
      id: 3,
      name: "Premium Packaging",
      contact: "Mike Chen",
      email: "mike@premium.com",
      phone: "+82-2-3456-7890",
      category: "Packaging",
      status: "Inactive",
      rating: 4.2,
      lastOrder: "2023-12-20"
    },
    {
      id: 4,
      name: "Quality Components",
      contact: "Lisa Park",
      email: "lisa@quality.com",
      phone: "+82-2-4567-8901",
      category: "Components",
      status: "Active",
      rating: 4.9,
      lastOrder: "2024-01-14"
    },
    {
      id: 5,
      name: "Fast Logistics",
      contact: "David Kim",
      email: "david@fastlogistics.com",
      phone: "+82-2-5678-9012",
      category: "Logistics",
      status: "Active",
      rating: 4.3,
      lastOrder: "2024-01-13"
    }
  ]

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // ”Ä API 8œ\ P´
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      setError('õ	Å´ pt0| ˆì$”p ä(ˆµÈä.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    suppliers,
    isLoading,
    error,
    refetch
  }
}