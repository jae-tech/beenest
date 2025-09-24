// 사용자 역할
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

// 거래처 상태
export enum SupplierStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

// 상품 상태
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

// 주문 상태
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// 재고 이동 타입
export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUST = "ADJUST",
  TRANSFER = "TRANSFER",
}

// 참조 타입 (재고 이동 관련)
export enum ReferenceType {
  ORDER = "ORDER",
  PURCHASE = "PURCHASE",
  ADJUSTMENT = "ADJUSTMENT",
  RETURN = "RETURN",
  INITIAL = "INITIAL",
}

// 재고 알림 타입
export enum AlertType {
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  OVERSTOCKED = "OVERSTOCKED",
}

// 거래 타입
export enum TransactionType {
  PURCHASE = "PURCHASE", // 매입
  SALE = "SALE", // 매출
}

// 거래 상태
export enum TransactionStatus {
  PENDING = "PENDING", // 대기 (임시저장)
  CONFIRMED = "CONFIRMED", // 확정 (정식 등록)
  CANCELLED = "CANCELLED", // 취소
}
