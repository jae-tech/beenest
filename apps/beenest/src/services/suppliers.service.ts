import { api } from '@/lib/api-client'
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SuppliersSearchParams,
  PaginatedResponse,
  ApiResponse
} from '@/types/api'

export const suppliersService = {
  // 공급업체 목록 조회 (페이징, 검색, 필터)
  async getSuppliers(params?: SuppliersSearchParams): Promise<PaginatedResponse<Supplier>> {
    return api.get<Supplier[]>('/suppliers', params)
  },

  // 공급업체 상세 조회
  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return api.get<Supplier>(`/suppliers/${id}`)
  },

  // 공급업체 생성
  async createSupplier(data: CreateSupplierRequest): Promise<ApiResponse<Supplier>> {
    return api.post<Supplier>('/suppliers', data)
  },

  // 공급업체 수정
  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<ApiResponse<Supplier>> {
    return api.put<Supplier>(`/suppliers/${id}`, data)
  },

  // 공급업체 삭제
  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/suppliers/${id}`)
  },

  // 공급업체별 통계
  async getSupplierStats(id: string): Promise<ApiResponse<any>> {
    return api.get<any>(`/suppliers/${id}/stats`)
  },

  // 공급업체 검색 (자동완성용)
  async searchSuppliers(query: string): Promise<ApiResponse<Supplier[]>> {
    return api.get<Supplier[]>('/suppliers/search', { q: query })
  },

  // 활성 공급업체 목록 (간단한 목록용)
  async getActiveSuppliers(): Promise<ApiResponse<Supplier[]>> {
    return api.get<Supplier[]>('/suppliers', { status: 'active', limit: 100 })
  }
}