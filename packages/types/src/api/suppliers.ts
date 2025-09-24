import { SupplierStats } from "../entities/supplier";
import { SupplierStatus } from "../enums/status";
import { BaseSearchParams } from "./common";

// 거래처 검색 파라미터
export interface SuppliersSearchParams extends BaseSearchParams {
  status?: SupplierStatus;
}

// 거래처 생성 요청
export interface CreateSupplierRequest {
  companyName: string;
  supplierCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxNumber?: string;
  supplierStatus?: SupplierStatus;
  rating?: number;
  notes?: string;
}

// 거래처 수정 요청
export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

// 거래처 통계 응답
export interface SuppliersStatsResponse extends SupplierStats {}
