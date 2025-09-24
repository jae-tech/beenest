import type {
  Transaction,
  TransactionFilters,
  TransactionItem,
  TransactionStats,
  TransactionSummary,
} from "../entities/transaction";
import type { TransactionStatus, TransactionType } from "../enums/status";

// ===== 거래 생성 요청 =====
export interface CreateTransactionRequest {
  transactionType: TransactionType;

  // 거래 상대방
  supplierId?: string; // 매입시 거래처 ID
  customerName?: string; // 매출시 고객명
  customerPhone?: string; // 매출시 고객 연락처

  // 거래 일시
  transactionDate: string; // ISO string

  // 메모
  notes?: string;

  // 거래 품목들
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    vatRate?: number; // 기본값 0.1 (10%)
  }>;
}

// ===== 거래 수정 요청 =====
export interface UpdateTransactionRequest {
  transactionType?: TransactionType;
  supplierId?: string;
  customerName?: string;
  customerPhone?: string;
  transactionDate?: string;
  notes?: string;
  status?: TransactionStatus;

  // 거래 품목 수정 (전체 교체)
  items?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    vatRate?: number;
  }>;
}

// ===== 거래 검색 파라미터 =====
export interface TransactionSearchParams {
  page?: number;
  limit?: number;
  search?: string; // 거래번호, 고객명, 거래처명 검색

  // 필터
  transactionType?: TransactionType;
  status?: TransactionStatus;
  supplierId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  minAmount?: number;
  maxAmount?: number;

  // 정렬
  sortBy?: "transactionDate" | "totalAmount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// ===== 거래 통계 요청 파라미터 =====
export interface TransactionStatsParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  transactionType?: TransactionType;
  supplierId?: string;
  groupBy?: "day" | "week" | "month" | "year";
}

// ===== 거래 상태 변경 요청 =====
export interface ChangeTransactionStatusRequest {
  status: TransactionStatus;
  reason?: string; // 취소 등의 사유
}

// ===== 거래 번호 생성 요청 =====
export interface GenerateTransactionNumberRequest {
  transactionType: TransactionType;
  transactionDate?: string; // 기본값: 오늘
}

// ===== 거래 번호 생성 응답 =====
export interface GenerateTransactionNumberResponse {
  transactionNumber: string;
  format: string; // 예: "PUR-20241201-001"
}

// ===== 거래 복사 요청 =====
export interface CopyTransactionRequest {
  transactionType?: TransactionType; // 다른 타입으로 복사 가능
  transactionDate?: string; // 새로운 거래일
  excludeItems?: string[]; // 제외할 품목 ID 목록
}

// ===== 대량 거래 생성 요청 =====
export interface BulkCreateTransactionsRequest {
  transactions: CreateTransactionRequest[];
  validateOnly?: boolean; // true시 검증만 수행
}

// ===== 대량 거래 생성 응답 =====
export interface BulkCreateTransactionsResponse {
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    index: number;
    success: boolean;
    transactionId?: string;
    transactionNumber?: string;
    error?: string;
  }>;
}

// ===== 거래 내보내기 요청 =====
export interface ExportTransactionsRequest {
  format: "excel" | "csv" | "pdf";
  filters?: TransactionSearchParams;
  columns?: string[]; // 내보낼 컬럼 선택
  template?: "standard" | "tax" | "simple";
}

// ===== 거래 내보내기 응답 =====
export interface ExportTransactionsResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string; // 다운로드 링크 만료 시간
}

// ===== 거래 재고 연동 요청 =====
export interface SyncTransactionInventoryRequest {
  transactionId: string;
  forceSync?: boolean; // 이미 동기화된 경우 강제 재동기화
}

// ===== 거래 재고 연동 응답 =====
export interface SyncTransactionInventoryResponse {
  success: boolean;
  affectedProducts: Array<{
    productId: string;
    productName: string;
    previousStock: number;
    newStock: number;
    stockChange: number;
  }>;
  errors?: string[];
}

// Re-export related types
export type {
  Transaction,
  TransactionFilters,
  TransactionItem,
  TransactionStats,
  TransactionSummary,
};
