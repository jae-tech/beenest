import { api } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api'

interface Category {
  id: string
  categoryName: string
  parentCategoryId?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  parentCategory?: {
    id: string
    categoryName: string
  }
  childCategories?: Array<{
    id: string
    categoryName: string
    displayOrder: number
    isActive: boolean
  }>
  _count?: {
    childCategories: number
    products: number
  }
  childrenCount?: number
  productCount?: number
}

export const categoriesService = {
  // 카테고리 목록 조회
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get<Category[]>('/categories')
  },

  // 활성 카테고리 목록 (드롭다운용)
  async getActiveCategories(): Promise<ApiResponse<Category[]>> {
    return api.get<Category[]>('/categories', { active: true })
  },

  // 카테고리 트리 구조
  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    return api.get<Category[]>('/categories/tree')
  },

  // 카테고리 상세 조회
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return api.get<Category>(`/categories/${id}`)
  },

  // 카테고리 생성
  async createCategory(data: {
    categoryName: string
    parentCategoryId?: string
    displayOrder?: number
  }): Promise<ApiResponse<Category>> {
    return api.post<Category>('/categories', data)
  },

  // 카테고리 수정
  async updateCategory(id: string, data: {
    categoryName?: string
    parentCategoryId?: string
    displayOrder?: number
    isActive?: boolean
  }): Promise<ApiResponse<Category>> {
    return api.patch<Category>(`/categories/${id}`, data)
  },

  // 카테고리 삭제
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/categories/${id}`)
  }
}