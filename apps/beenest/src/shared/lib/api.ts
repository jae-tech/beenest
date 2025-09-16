// API 구현 전까지 기존 하드코딩 데이터를 반환하는 mock 함수들
// 추후 실제 API로 교체될 예정

// Mock data (기존 demo.tsx에서 사용하던 데이터와 동일)
const mockDashboardMetrics = [
  {
    icon: "fas fa-boxes",
    title: "Total Stock",
    value: "23,340 Units",
    change: "+25%",
    color: "bg-green-500",
    trend: "up" as const,
  },
  {
    icon: "fas fa-dollar-sign",
    title: "Total Inventory Value",
    value: "$23,56847",
    change: "+25%",
    color: "bg-yellow-500",
    trend: "up" as const,
  },
  {
    icon: "fas fa-bullseye",
    title: "Total Picking Accuracy",
    value: "90%",
    change: "+4%",
    color: "bg-blue-500",
    trend: "up" as const,
  },
  {
    icon: "fas fa-clock",
    title: "Pending Orders",
    value: "7350",
    change: "+7%",
    color: "bg-purple-500",
    trend: "up" as const,
  },
  {
    icon: "fas fa-exclamation-triangle",
    title: "Low Stock Items",
    value: "152 Units",
    change: "-10%",
    color: "bg-red-500",
    trend: "down" as const,
  },
]

const mockInventoryData = [
  {
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    stock: 245,
    price: 89.99,
    status: "In Stock",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    name: "Cotton T-Shirt",
    sku: "CT-002",
    category: "Apparel",
    stock: 15,
    price: 24.99,
    status: "Low Stock",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Laptop Backpack",
    sku: "LB-003",
    category: "Accessories",
    stock: 0,
    price: 49.99,
    status: "Out of Stock",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    name: "Bluetooth Speaker",
    sku: "BS-004",
    category: "Electronics",
    stock: 128,
    price: 79.99,
    status: "In Stock",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    name: "Running Shoes",
    sku: "RS-005",
    category: "Footwear",
    stock: 67,
    price: 129.99,
    status: "In Stock",
    statusColor: "bg-green-100 text-green-800",
  },
]

const mockSupplierData = [
  {
    name: "TechSupply Co.",
    contact: "john@techsupply.com",
    location: "New York, USA",
    products: 45,
    orders: 128,
    rating: 4.9,
    status: "Active",
  },
  {
    name: "Global Electronics",
    contact: "sarah@globalelec.com",
    location: "London, UK",
    products: 78,
    orders: 256,
    rating: 4.7,
    status: "Active",
  },
  {
    name: "Fashion Forward",
    contact: "mike@fashionfw.com",
    location: "Paris, France",
    products: 123,
    orders: 89,
    rating: 4.8,
    status: "Pending",
  },
  {
    name: "Sports Gear Ltd",
    contact: "emma@sportsgear.com",
    location: "Berlin, Germany",
    products: 67,
    orders: 145,
    rating: 4.6,
    status: "Active",
  },
]

const mockOrderData = [
  {
    id: "#ORD-2024-001",
    customer: "Acme Corp",
    products: 5,
    amount: 1250.0,
    date: "2024-01-15",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "#ORD-2024-002",
    customer: "Tech Solutions",
    products: 3,
    amount: 890.5,
    date: "2024-01-14",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "#ORD-2024-003",
    customer: "Global Industries",
    products: 8,
    amount: 2100.75,
    date: "2024-01-13",
    status: "Processing",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "#ORD-2024-004",
    customer: "StartUp Inc",
    products: 2,
    amount: 450.0,
    date: "2024-01-12",
    status: "Pending",
    statusColor: "bg-gray-100 text-gray-800",
  },
  {
    id: "#ORD-2024-005",
    customer: "Enterprise Ltd",
    products: 12,
    amount: 3200.25,
    date: "2024-01-11",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
  },
]

// Mock API 함수들
export const api = {
  // Dashboard
  getDashboardMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)) // 네트워크 지연 시뮬레이션
    return mockDashboardMetrics
  },

  // Inventory
  getInventoryItems: async (filters?: { search?: string; category?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    let filteredData = [...mockInventoryData]

    if (filters?.search) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        item.sku.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    if (filters?.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item =>
        item.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }

    return filteredData
  },

  getInventoryItem: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockInventoryData.find(item => item.sku === id)
  },

  // Suppliers
  getSuppliers: async (filters?: { search?: string; status?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    let filteredData = [...mockSupplierData]

    if (filters?.search) {
      filteredData = filteredData.filter(supplier =>
        supplier.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    if (filters?.status && filters.status !== 'all') {
      filteredData = filteredData.filter(supplier =>
        supplier.status.toLowerCase() === filters.status!.toLowerCase()
      )
    }

    return filteredData
  },

  // Orders
  getOrders: async (filters?: { search?: string; status?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    let filteredData = [...mockOrderData]

    if (filters?.search) {
      filteredData = filteredData.filter(order =>
        order.id.toLowerCase().includes(filters.search!.toLowerCase()) ||
        order.customer.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    if (filters?.status && filters.status !== 'all') {
      filteredData = filteredData.filter(order =>
        order.status.toLowerCase() === filters.status!.toLowerCase()
      )
    }

    return filteredData
  },

  // Customers (새로 추가)
  getCustomers: async (filters?: { search?: string; status?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // 기본 고객 데이터
    const mockCustomers = [
      {
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        orders: 12,
        totalSpent: 2840.50,
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 987-6543",
        orders: 8,
        totalSpent: 1650.75,
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
      },
    ]
    return mockCustomers
  },

  // Shipments (새로 추가)
  getShipments: async (filters?: { search?: string; status?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockShipments = [
      {
        trackingId: "#TRK-2024-001",
        customer: "John Smith",
        destination: "New York, NY",
        shipDate: "2024-01-15",
        estDelivery: "2024-01-18",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800",
      },
    ]
    return mockShipments
  },

  // Reports (새로 추가)
  getReports: async (type: 'sales' | 'inventory' | 'customers' | 'financial') => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const mockReports = {
      sales: [
        { period: "January 2024", orders: 1247, revenue: 156780, avgOrder: 125.67, growth: "+24.5%" },
        { period: "December 2023", orders: 1089, revenue: 142340, avgOrder: 130.72, growth: "+18.2%" },
      ],
      inventory: [],
      customers: [],
      financial: [],
    }
    return mockReports[type]
  },
}