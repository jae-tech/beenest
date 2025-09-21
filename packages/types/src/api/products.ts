import { BaseSearchParams } from './common'
import { Product, Category, ProductStats } from '../entities/product'
import { ProductStatus } from '../enums/status'

// 상품 검색 파라미터
export interface ProductsSearchParams extends BaseSearchParams {
  categoryId?: string
  supplierId?: string
  status?: ProductStatus
}

// 상품 생성 요청
export interface CreateProductRequest {
  productName: string
  productCode: string
  description?: string
  categoryId?: string
  unitPrice: number
  costPrice?: number
  barcode?: string
  weight?: number
  dimensions?: string
  imageUrl?: string
  status?: ProductStatus
}

// 상품 수정 요청
export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// 카테고리 생성 요청
export interface CreateCategoryRequest {
  categoryName: string
  parentCategoryId?: string
  displayOrder?: number
  isActive?: boolean
}

// 카테고리 수정 요청
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

// 상품 통계 응답
export interface ProductsStatsResponse extends ProductStats {}