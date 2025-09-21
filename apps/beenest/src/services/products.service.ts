import { api } from '@/lib/api-client'
import type { Product } from '@beenest/types'
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductsSearchParams,
  PaginatedResponse
} from '@/types/api'

export const productsService = {
  // 상품 목록 조회 (페이징, 검색, 필터)
  async getProducts(params?: ProductsSearchParams): Promise<PaginatedResponse<Product>> {
    return api.get<PaginatedResponse<Product>>('/products', params)
  },

  // 상품 상세 조회
  async getProduct(id: string): Promise<Product> {
    return api.get<Product>(`/products/${id}`)
  },

  // 상품 생성
  async createProduct(data: CreateProductRequest): Promise<Product> {
    return api.post<Product>('/products', data)
  },

  // 상품 수정
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    return api.put<Product>(`/products/${id}`, data)
  },

  // 상품 삭제
  async deleteProduct(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/products/${id}`)
  },

  // 재고 수동 조정
  async adjustStock(id: string, data: { quantity: number; reason?: string }): Promise<Product> {
    return api.post<Product>(`/products/${id}/stock`, data)
  },

  // 재고 부족 상품 목록
  async getLowStockProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products/low-stock')
  },

  // 상품 검색 (자동완성용)
  async searchProducts(query: string): Promise<Product[]> {
    return api.get<Product[]>('/products/search', { q: query })
  },

  // 상품별 재고 이력
  async getStockHistory(id: string): Promise<any[]> {
    return api.get<any[]>(`/products/${id}/stock-history`)
  }
}