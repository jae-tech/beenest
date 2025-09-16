import { useState } from 'react'

export interface OrderStat {
  icon: string
  title: string
  value: string
  color: string
  change: string
}

export interface Order {
  id: string
  customer: string
  items: string
  total: string
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending' | 'Cancelled'
  date: string
  statusColor: string
}

export interface OrderTab {
  id: string
  label: string
  count: number
}

export const useOrders = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'Samsung Electronics',
      items: 'Wireless Headphones x2',
      total: '©800,000',
      status: 'Processing',
      date: '2024-01-15',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'ORD-002',
      customer: 'LG Display',
      items: 'Monitor Stand x5',
      total: '©250,000',
      status: 'Shipped',
      date: '2024-01-14',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'ORD-003',
      customer: 'Hyundai Motors',
      items: 'Car Accessories x3',
      total: '©1,500,000',
      status: 'Delivered',
      date: '2024-01-13',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'ORD-004',
      customer: 'SK Hynix',
      items: 'Memory Cards x10',
      total: '©3,200,000',
      status: 'Pending',
      date: '2024-01-12',
      statusColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'ORD-005',
      customer: 'POSCO',
      items: 'Industrial Tools x1',
      total: '©5,000,000',
      status: 'Cancelled',
      date: '2024-01-11',
      statusColor: 'bg-red-100 text-red-800'
    }
  ]

  const stats: OrderStat[] = [
    {
      icon: "fas fa-shopping-cart",
      title: "Total Orders",
      value: orders.length.toString(),
      color: "bg-blue-500",
      change: "— +12% from last month"
    },
    {
      icon: "fas fa-clock",
      title: "Processing",
      value: orders.filter(o => o.status === 'Processing').length.toString(),
      color: "bg-yellow-500",
      change: "’ Same as last month"
    },
    {
      icon: "fas fa-truck",
      title: "Shipped",
      value: orders.filter(o => o.status === 'Shipped').length.toString(),
      color: "bg-blue-500",
      change: "— +8% from last month"
    },
    {
      icon: "fas fa-check-circle",
      title: "Delivered",
      value: orders.filter(o => o.status === 'Delivered').length.toString(),
      color: "bg-green-500",
      change: "— +15% from last month"
    },
    {
      icon: "fas fa-won-sign",
      title: "Revenue",
      value: "©10.7M",
      color: "bg-purple-500",
      change: "— +20% from last month"
    }
  ]

  const tabs: OrderTab[] = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length }
  ]

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status.toLowerCase() === activeTab)

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // ”Ä API 8œ\ P´
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      setError('ü8 pt0| ˆì$”p ä(ˆµÈä.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    orders: filteredOrders,
    allOrders: orders,
    tabs,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    refetch
  }
}