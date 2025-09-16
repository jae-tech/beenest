// Base Types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  avatar?: string
  lastLogin?: string
}

// Dashboard Types
export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  lowStockItems: number
  monthlyRevenue: RevenueData[]
  recentOrders: OrderSummary[]
}

export interface RevenueData {
  month: string
  revenue: number
}

export interface OrderSummary {
  id: string
  customerName: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  date: string
}

// Inventory Types
export interface InventoryItem extends BaseEntity {
  name: string
  sku: string
  description?: string
  category: string
  quantity: number
  unit: string
  price: number
  cost?: number
  lowStockThreshold: number
  supplier?: string
  location?: string
  lastUpdated: string
}

export interface InventoryFilters {
  searchTerm: string
  category: string
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  minStock: string
  maxStock: string
  sortBy: keyof InventoryItem | ''
  sortOrder: 'asc' | 'desc'
}

// Supplier Types
export interface Supplier extends BaseEntity {
  name: string
  contact: string
  email: string
  phone?: string
  location: string
  address?: string
  products: number
  orders: number
  rating: number
  status: 'active' | 'pending' | 'inactive'
}

export interface SupplierStats {
  totalSuppliers: number
  activeSuppliers: number
  pendingOrders: number
  avgRating: number
}

// Order Types
export interface Order extends BaseEntity {
  orderNumber: string
  customerId: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  deliveryDate?: string
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
  lastUpdated: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// UI Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export type AppView = 'dashboard' | 'inventory' | 'suppliers' | 'orders' | 'reports' | 'settings'

export interface PaginationState {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationState
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, item: T) => React.ReactNode
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: object
}

export interface FormError {
  field: string
  message: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Chart Types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  label?: string
}

// Common Status Types
export type Status = 'idle' | 'loading' | 'success' | 'error'
export type Theme = 'light' | 'dark' | 'system'