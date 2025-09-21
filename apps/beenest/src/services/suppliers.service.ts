import { api } from '@/lib/api-client'
import type { Supplier } from '@beenest/types'
import type {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SuppliersSearchParams,
  PaginatedResponse
} from '@/types/api'

export const suppliersService = {
  // 공급업체 목록 조회 (페이징, 검색, 필터)
  async getSuppliers(params?: SuppliersSearchParams): Promise<PaginatedResponse<Supplier>> {
    return api.get<PaginatedResponse<Supplier>>('/suppliers', params)
  },

  // 공급업체 전체 통계
  async getAllSupplierStats(): Promise<any> {
    return api.get<any>('/suppliers/stats')
  },

  // 공급업체 상세 조회
  async getSupplier(id: string): Promise<Supplier> {
    return api.get<Supplier>(`/suppliers/${id}`)
  },

  // 공급업체 생성
  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    return api.post<Supplier>('/suppliers', data)
  },

  // 공급업체 수정
  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<Supplier> {
    return api.put<Supplier>(`/suppliers/${id}`, data)
  },

  // 공급업체 삭제
  async deleteSupplier(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/suppliers/${id}`)
  },

  // 공급업체별 통계
  async getSupplierStats(id: string): Promise<any> {
    return api.get<any>(`/suppliers/${id}/stats`)
  },

  // 공급업체 검색 (자동완성용)
  async searchSuppliers(query: string): Promise<Supplier[]> {
    return api.get<Supplier[]>('/suppliers/search', { q: query })
  },

  // 활성 공급업체 목록 (간단한 목록용)
  async getActiveSuppliers(): Promise<Supplier[]> {
    return api.get<Supplier[]>('/suppliers', { status: 'active', limit: 100 })
  }
}