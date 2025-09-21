import { ProductStatus } from '../enums/status'

// 카테고리 엔티티
export interface Category {
  id: string
  categoryName: string
  parentCategoryId?: string
  displayOrder?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 상품 엔티티
export interface Product {
  id: string
  productCode: string
  productName: string
  description?: string
  categoryId?: string
  unitPrice: number
  costPrice?: number
  barcode?: string
  weight?: number
  dimensions?: string
  imageUrl?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  // Relations (optional for API responses)
  category?: Category
  inventory?: {
    id: string
    currentStock: number
    minStockLevel: number
    maxStockLevel?: number
    reorderPoint?: number
  }
}

// 상품 통계
export interface ProductStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
}