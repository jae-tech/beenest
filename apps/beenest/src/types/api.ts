// API 응답 공통 형식
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  message?: string
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  success: boolean
  data: {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
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
  productCode: string
  productName: string
  description?: string
  categoryId?: string
  unitPrice: number
  costPrice?: number
  barcode?: string
  weight?: number
  dimensions?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  category?: {
    id: string
    categoryName: string
  }
  inventory?: {
    id: string
    productId: string
    currentStock: number
    reservedStock: number
    minimumStock: number
    reorderPoint: number
    availableStock: number
  }
  preferredSupplier?: {
    id: string
    companyName: string
    supplierCode: string
  }
}

// 공급업체 타입
export interface Supplier {
  id: string
  supplierCode: string
  companyName: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  taxNumber?: string
  status: 'active' | 'inactive' | 'pending'
  rating?: number
  notes?: string
  createdBy: string
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
  orderNumber: string
  supplierId: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  expectedDeliveryDate?: string
  totalAmount: number
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  supplier?: {
    id: string
    companyName: string
    supplierCode: string
  }
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

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id?: string
}

export interface CreateSupplierRequest {
  name: string
  contact?: string
  email?: string
  phone?: string
  location?: string
  status?: 'active' | 'inactive'
  rating?: number
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id?: string
}

export interface CreateOrderRequest {
  supplierId: string
  orderDate: string
  expectedDeliveryDate?: string
  notes?: string
  orderItems: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
}

export interface LoginRequest {
  email: string
  password: string
}

// 재고 관리 타입들
export type MovementType = 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER'
export type ReferenceType = 'ORDER' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN' | 'INITIAL'
export type AlertType = 'OUT_OF_STOCK' | 'REORDER_POINT' | 'LOW_STOCK'

export interface Inventory {
  id: string
  productId: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minimumStock: number
  maximumStock?: number
  reorderPoint: number
  warehouseLocation: string
  lastStockCheckAt?: string
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  movementType: MovementType
  quantity: number
  unitCost?: number
  referenceType?: string
  referenceId?: string
  notes?: string
  createdAt: string
  createdBy: string
  creator?: {
    id: string
    name: string
  }
  product?: {
    id: string
    productCode: string
    productName: string
    unitPrice: number
    category?: {
      id: string
      categoryName: string
    }
  }
}

export interface InventoryByProduct {
  product: {
    id: string
    productCode: string
    productName: string
    unitPrice: number
    costPrice?: number
    category?: {
      id: string
      categoryName: string
    }
  }
  inventory?: Inventory
}

export interface LowStockAlert {
  product: {
    id: string
    productCode: string
    productName: string
    unitPrice: number
    category?: {
      id: string
      categoryName: string
    }
  }
  inventory: Inventory & {
    alertType: AlertType
  }
  preferredSupplier?: {
    id: string
    companyName: string
    supplierCode: string
    contactPerson?: string
    phone?: string
    email?: string
  }
}

export interface InventoryStats {
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  normalStockCount: number
  totalInventoryValue: number
  alertsCount: number
}

export interface AdjustStockRequest {
  quantity: number
  movementType: MovementType
  unitCost?: number
  referenceType?: ReferenceType
  referenceId?: string
  notes?: string
  reason: string
}

export interface UpdateInventoryRequest {
  warehouseLocation?: string
  reservedStock?: number
  minimumStock?: number
  maximumStock?: number
  reorderPoint?: number
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