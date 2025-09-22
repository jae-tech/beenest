// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 페이지네이션 응답 타입 (성공 시)
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

// 에러 응답 타입 (HTTP 4xx/5xx 시)
export interface ApiError {
  code: string
  message: string
  details?: string
}

// 에러 응답 래퍼
export interface ErrorResponse {
  error: ApiError
}