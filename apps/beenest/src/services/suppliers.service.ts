import { api } from "@/lib/api-client";
import type {
  CreateSupplierRequest,
  PaginatedResponse,
  SuppliersSearchParams,
  UpdateSupplierRequest,
} from "@/types/api";
import type { Supplier } from "@beenest/types";

export const suppliersService = {
  // 거래처 목록 조회 (페이징, 검색, 필터)
  async getSuppliers(
    params?: SuppliersSearchParams
  ): Promise<PaginatedResponse<Supplier>> {
    return api.get<PaginatedResponse<Supplier>>("/suppliers", params);
  },

  // 거래처 전체 통계
  async getAllSupplierStats(): Promise<any> {
    return api.get<any>("/suppliers/stats");
  },

  // 거래처 상세 조회
  async getSupplier(id: string): Promise<Supplier> {
    return api.get<Supplier>(`/suppliers/${id}`);
  },

  // 거래처 생성
  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    return api.post<Supplier>("/suppliers", data);
  },

  // 거래처 수정
  async updateSupplier(
    id: string,
    data: UpdateSupplierRequest
  ): Promise<Supplier> {
    return api.put<Supplier>(`/suppliers/${id}`, data);
  },

  // 거래처 삭제
  async deleteSupplier(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/suppliers/${id}`);
  },

  // 거래처별 통계
  async getSupplierStats(id: string): Promise<any> {
    return api.get<any>(`/suppliers/${id}/stats`);
  },

  // 거래처 검색 (자동완성용)
  async searchSuppliers(query: string): Promise<Supplier[]> {
    return api.get<Supplier[]>("/suppliers/search", { q: query });
  },

  // 활성 거래처 목록 (간단한 목록용)
  async getActiveSuppliers(): Promise<Supplier[]> {
    return api.get<Supplier[]>("/suppliers", { status: "active", limit: 100 });
  },
};
