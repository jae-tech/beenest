// ================================
// Re-export types from @beenest/types
// ================================
export type {
  AlertType,
  ApiError,
  BaseSearchParams,
  ErrorResponse,
  MovementType,
  OrderStatus,
  PaginatedResponse,
  Pagination,
  ProductStatus,
  SupplierStatus,
  TransactionStatus,
  TransactionType,
  UserRole,
} from "@beenest/types";

// Re-export entity types
export type {
  Product as BackendProduct,
  Category,
  Inventory,
  InventoryByProduct,
  InventoryStats,
  LowStockAlert,
  Order,
  OrderItem,
  OrderStats,
  ProductStats,
  StockMovement,
  Supplier,
  SupplierStats,
  Transaction,
  TransactionFilters,
  TransactionItem,
  TransactionStats,
  TransactionSummary,
  User,
  UserProfile,
} from "@beenest/types";

// 거래 관련 타입들은 백엔드에 다른 이름으로 존재하므로 주석 처리
// 필요시 별도로 정의

// ================================
// 프론트엔드 전용 타입
// ================================

// 로그인 데이터 구조 (프론트엔드 전용)
export interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
  token: string; // 기존 호환성을 위해 유지
}

// 로그인 응답 (직접 데이터 반환)
export type LoginResponse = LoginData;

// 프론트엔드에서 사용하는 Product 타입 (백엔드 Product 확장)
export interface Product extends BackendProduct {
  inventory?: {
    id: string;
    productId: string;
    currentStock: number;
    reservedStock: number;
    minimumStock: number;
    reorderPoint: number;
    availableStock: number;
  };
  preferredSupplier?: {
    id: string;
    companyName: string;
    supplierCode: string;
  };
}

// 대시보드 통계 타입 (프론트엔드 전용)
export interface DashboardStats {
  overview: {
    totalProducts: number;
    totalInventoryValue: number;
    recentOrders: number;
    totalSuppliers: number;
  };
  inventory: {
    lowStockCount: number;
    outOfStockCount: number;
    reorderRequired: number;
  };
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
}

// ================================
// API 요청 타입 (상품 관리)
// ================================

export interface CreateProductRequest {
  productCode: string;
  productName: string;
  description?: string;
  categoryId?: number;
  unitPrice: number;
  costPrice?: number;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  isActive?: boolean;
  // 재고 관련 (선택사항)
  initialStock?: number;
  minimumStock?: number;
  maximumStock?: number;
  reorderPoint?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsSearchParams extends BaseSearchParams {
  categoryId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
  [key: string]: unknown;
}

// ================================
// API 요청 타입 (거래처 관리)
// ================================

export interface CreateSupplierRequest {
  companyName: string;
  supplierCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxNumber?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  rating?: number;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface SuppliersSearchParams extends BaseSearchParams {
  status?: SupplierStatus;
  rating?: number;
  [key: string]: unknown;
}

// ================================
// API 요청 타입 (주문 관리)
// ================================

export interface CreateOrderRequest {
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  orderItems: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {
  status?: OrderStatus;
}

export interface OrdersSearchParams extends BaseSearchParams {
  supplierId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

// ================================
// API 요청 타입 (재고 관리)
// ================================

export interface AdjustStockRequest {
  quantity: number;
  reason?: string;
  notes?: string;
}

export interface InventorySearchParams extends BaseSearchParams {
  productId?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  [key: string]: unknown;
}

// ================================
// 인증 관련 타입
// ================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

// ================================
// 공통 유틸리티 타입
// ================================

export type PaginatedData<T> = PaginatedResponse<T>;

// TooltipPayload 타입 추가 (차트에서 사용)
export interface TooltipPayload {
  value: number;
  name: string;
  color: string;
  payload: any;
}
