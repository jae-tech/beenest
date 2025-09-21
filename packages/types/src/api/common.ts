// 공통 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// 검색 파라미터 기본 타입
export interface BaseSearchParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

// 에러 타입
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}