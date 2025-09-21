// ================================
// Re-export types from @beenest/types
// ================================
export {
  UserRole,
  SupplierStatus,
  ProductStatus,
  OrderStatus,
  MovementType,
  AlertType
} from '@beenest/types'

// ================================
// 공통 API 타입 (표준화된 응답 구조)
// ================================

// 에러 구조 표준화
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

// 기본 API 응답 (모든 API의 기본 구조)
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

// 페이지네이션 메타 정보
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 페이지네이션 데이터 구조
export interface PaginatedData<T> {
  data: T[]
  pagination: PaginationMeta
}

// 페이지네이션 응답 (ApiResponse로 감싸진 형태)
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>

// ================================
// 엔티티 타입
// ================================

// 사용자 타입
export interface User {
  id: string
  email: string
  name: string
  companyName?: string
  createdAt: string
  updatedAt: string
}

// 로그인 데이터 구조
export interface LoginData {
  user: User
  accessToken: string
  refreshToken: string
  token: string // 기존 호환성을 위해 유지
}

// 로그인 응답 (표준화된 ApiResponse 구조)
export type LoginResponse = ApiResponse<LoginData>

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
  status: ProductStatus
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
  supplierStatus: SupplierStatus
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
  status: OrderStatus
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

// ================================
// API 요청 타입 (상품 관리)
// ================================

export interface CreateProductRequest {
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
  isActive?: boolean
  // 재고 관련 (선택사항)
  initialStock?: number
  minimumStock?: number
  maximumStock?: number
  reorderPoint?: number
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id?: string
}

// ================================
// API 요청 타입 (공급업체 관리)
// ================================

export interface CreateSupplierRequest {
  companyName: string
  supplierCode?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  taxNumber?: string
  supplierStatus?: SupplierStatus
  rating?: number
  notes?: string
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

// ================================
// API 요청 타입 (주문 관리)
// ================================

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
  status?: OrderStatus
}

// ================================
// API 요청 타입 (인증)
// ================================

export interface LoginRequest {
  email: string
  password: string
}

// ================================
// 재고 관리 타입
// ================================

// 재고 관리 타입
export type ReferenceType = 'ORDER' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN' | 'INITIAL'

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

// ================================
// API 요청 타입 (재고 관리)
// ================================

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

// ================================
// 검색 및 필터 파라미터
// ================================
export interface ProductsSearchParams {
  page?: number
  limit?: number
  search?: string
  supplierId?: string
  categoryId?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface SuppliersSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
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
  [key: string]: unknown
}