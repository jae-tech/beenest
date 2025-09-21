/**
 * Prisma 모델과 공통 타입 간 매핑 유틸리티
 */

import { MovementType, ReferenceType, OrderStatus, SupplierStatus, ProductStatus } from '@beenest/types';

/**
 * Prisma의 string movementType을 MovementType enum으로 변환
 */
export function mapMovementType(type: string): MovementType {
  switch (type) {
    case 'IN':
      return MovementType.IN;
    case 'OUT':
      return MovementType.OUT;
    case 'ADJUST':
      return MovementType.ADJUST;
    case 'TRANSFER':
      return MovementType.TRANSFER;
    default:
      throw new Error(`Invalid movement type: ${type}`);
  }
}

/**
 * Prisma의 string referenceType을 ReferenceType enum으로 변환
 */
export function mapReferenceType(type: string): ReferenceType {
  switch (type) {
    case 'ORDER':
      return ReferenceType.ORDER;
    case 'PURCHASE':
      return ReferenceType.PURCHASE;
    case 'ADJUSTMENT':
      return ReferenceType.ADJUSTMENT;
    case 'RETURN':
      return ReferenceType.RETURN;
    case 'INITIAL':
      return ReferenceType.INITIAL;
    default:
      throw new Error(`Invalid reference type: ${type}`);
  }
}

/**
 * Prisma의 string orderStatus를 OrderStatus enum으로 변환
 */
export function mapOrderStatus(status: string): OrderStatus {
  switch (status) {
    case 'PENDING':
      return OrderStatus.PENDING;
    case 'CONFIRMED':
      return OrderStatus.CONFIRMED;
    case 'SHIPPED':
      return OrderStatus.SHIPPED;
    case 'DELIVERED':
      return OrderStatus.DELIVERED;
    case 'CANCELLED':
      return OrderStatus.CANCELLED;
    default:
      throw new Error(`Invalid order status: ${status}`);
  }
}

/**
 * Prisma의 string supplierStatus를 SupplierStatus enum으로 변환
 */
export function mapSupplierStatus(status: string): SupplierStatus {
  switch (status) {
    case 'active':
      return SupplierStatus.ACTIVE;
    case 'inactive':
      return SupplierStatus.INACTIVE;
    case 'pending':
      return SupplierStatus.PENDING;
    case 'suspended':
      return SupplierStatus.SUSPENDED;
    default:
      throw new Error(`Invalid supplier status: ${status}`);
  }
}

/**
 * Prisma의 boolean isActive를 ProductStatus enum으로 변환
 */
export function mapProductStatus(isActive: boolean): ProductStatus {
  return isActive ? ProductStatus.ACTIVE : ProductStatus.INACTIVE;
}

/**
 * StockMovement 데이터를 공통 타입으로 변환
 */
export function mapStockMovement(movement: any) {
  return {
    ...movement,
    movementType: mapMovementType(movement.movementType),
    referenceType: movement.referenceType ? mapReferenceType(movement.referenceType) : undefined,
  };
}

/**
 * Order 데이터를 공통 타입으로 변환
 */
export function mapOrder(order: any) {
  return {
    ...order,
    status: mapOrderStatus(order.status),
  };
}

/**
 * Supplier 데이터를 공통 타입으로 변환
 */
export function mapSupplier(supplier: any) {
  return {
    ...supplier,
    supplierStatus: mapSupplierStatus(supplier.supplierStatus),
  };
}

/**
 * Product 데이터를 공통 타입으로 변환
 */
export function mapProduct(product: any) {
  return {
    ...product,
    status: mapProductStatus(product.isActive),
  };
}