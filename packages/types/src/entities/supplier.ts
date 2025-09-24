import { SupplierStatus } from "../enums/status";

// 거래처 엔티티
export interface Supplier {
  id: string;
  supplierCode: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  businessRegistration?: string;
  taxId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country: string;
  paymentTerms?: string;
  creditLimit: number;
  rating?: number;
  supplierStatus: SupplierStatus;
  notes?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // 추가 계산 필드 (백엔드에서 포함)
  productCount?: number;
}

// 거래처 통계
export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  topSuppliers: Array<{
    id: string;
    companyName: string;
    supplierCode: string;
    productCount: number;
    rating?: number;
  }>;
}
