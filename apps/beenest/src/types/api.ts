// API 응답 공통 형식
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  message?: string
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// 사용자 타입
export interface User {
  id: string
  email: string
  name: string
  companyName?: string
  createdAt: string
  updatedAt: string
}

// 로그인 응답
export interface LoginResponse {
  user: User
  token: string
}

// 상품 타입 (백엔드와 동기화)
export interface Product {
  id: string
  userId: string
  supplierId?: string
  categoryId?: string
  name: string
  sku: string
  description?: string
  price: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  imageUrl?: string
  status: 'active' | 'inactive' | 'discontinued'
  createdAt: string
  updatedAt: string
  supplier?: Supplier
  category?: Category
}

// 공급업체 타입
export interface Supplier {
  id: string
  userId: string
  name: string
  contact?: string
  email?: string
  phone?: string
  location?: string
  status: 'active' | 'inactive'
  rating?: number
  createdAt: string
  updatedAt: string
}

// 카테고리 타입
export interface Category {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// 주문 타입
export interface Order {
  id: string
  userId: string
  supplierId: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  expectedDeliveryDate?: string
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
  supplier?: Supplier
  orderItems?: OrderItem[]
}

// 주문 아이템 타입
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

// 재고 이동 타입
export interface StockMovement {
  id: string
  productId: string
  movementType: 'in' | 'out' | 'adjustment'
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  referenceId?: string
  referenceType?: string
  createdAt: string
  product?: Product
}

// 대시보드 통계 타입
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalSuppliers: number
  lowStockProducts: number
  pendingOrders: number
  revenueGrowth: number
  ordersGrowth: number
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[]
  revenue: number[]
  orders: number[]
}

// API 요청 타입들
export interface CreateProductRequest {
  name: string
  sku: string
  description?: string
  price: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  supplierId?: string
  categoryId?: string
  imageUrl?: string
  status?: 'active' | 'inactive'
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateSupplierRequest {
  name: string
  contact?: string
  email?: string
  phone?: string
  location?: string
  status?: 'active' | 'inactive'
  rating?: number
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  companyName?: string
}

// 검색 및 필터 파라미터
export interface ProductsSearchParams {
  page?: number
  limit?: number
  search?: string
  supplierId?: string
  categoryId?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SuppliersSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface OrdersSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  supplierId?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}