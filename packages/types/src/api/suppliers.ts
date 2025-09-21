import { BaseSearchParams } from './common'
import { Supplier, SupplierStats } from '../entities/supplier'
import { SupplierStatus } from '../enums/status'

// 공급업체 검색 파라미터
export interface SuppliersSearchParams extends BaseSearchParams {
  status?: SupplierStatus
}

// 공급업체 생성 요청
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

// 공급업체 수정 요청
export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

// 공급업체 통계 응답
export interface SuppliersStatsResponse extends SupplierStats {}