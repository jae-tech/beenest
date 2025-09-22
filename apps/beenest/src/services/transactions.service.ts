import { api } from '@/lib/api-client';
import type {
  GetTransactionsParams,
  GetTransactionsResponse,
  TransactionStatsResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  GetTransactionResponse,
  DeleteTransactionResponse,
  GetTransactionStatsParams,
  MonthlyTransactionStats,
  PartnerTransactionStats,
  ProductTransactionStats,
  Transaction
} from '@beenest/types';

export const transactionsService = {
  // 거래 목록 조회 (페이징, 검색, 필터)
  async getTransactions(params?: GetTransactionsParams): Promise<GetTransactionsResponse> {
    return api.get<GetTransactionsResponse>('/transactions', params);
  },

  // 거래 상세 조회
  async getTransaction(id: string): Promise<GetTransactionResponse> {
    return api.get<GetTransactionResponse>(`/transactions/${id}`);
  },

  // 거래 생성
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    return api.post<Transaction>('/transactions', data);
  },

  // 거래 수정
  async updateTransaction(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    return api.put<Transaction>(`/transactions/${id}`, data);
  },

  // 거래 삭제
  async deleteTransaction(id: string): Promise<DeleteTransactionResponse> {
    return api.delete<DeleteTransactionResponse>(`/transactions/${id}`);
  },

  // 거래 상태 변경
  async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
    return api.patch<Transaction>(`/transactions/${id}/status`, { status });
  },

  // 거래 통계 조회
  async getTransactionStats(params?: GetTransactionStatsParams): Promise<TransactionStatsResponse> {
    return api.get<TransactionStatsResponse>('/transactions/stats', params);
  },

  // 월별 거래 통계
  async getMonthlyStats(params?: GetTransactionStatsParams): Promise<MonthlyTransactionStats[]> {
    return api.get<MonthlyTransactionStats[]>('/transactions/stats/monthly', params);
  },

  // 거래처별 통계
  async getPartnerStats(params?: GetTransactionStatsParams): Promise<PartnerTransactionStats[]> {
    return api.get<PartnerTransactionStats[]>('/transactions/stats/partners', params);
  },

  // 상품별 거래 통계
  async getProductStats(params?: GetTransactionStatsParams): Promise<ProductTransactionStats[]> {
    return api.get<ProductTransactionStats[]>('/transactions/stats/products', params);
  },

  // 거래번호 중복 확인
  async checkTransactionNumber(transactionNumber: string): Promise<{ exists: boolean }> {
    return api.get<{ exists: boolean }>(`/transactions/check-number/${transactionNumber}`);
  },

  // 거래 내보내기 (Excel/CSV)
  async exportTransactions(params?: GetTransactionsParams, format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    return api.getBlob(`/transactions/export?format=${format}`, params);
  },

  // 대량 거래 가져오기 (Excel/CSV)
  async importTransactions(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: number; failed: number; errors: string[] }>('/transactions/import', formData);
  },

  // 거래 복제
  async duplicateTransaction(id: string): Promise<Transaction> {
    return api.post<Transaction>(`/transactions/${id}/duplicate`);
  },

  // 거래 승인 (관리자용)
  async approveTransaction(id: string): Promise<Transaction> {
    return api.patch<Transaction>(`/transactions/${id}/approve`);
  },

  // 거래 반려 (관리자용)
  async rejectTransaction(id: string, reason?: string): Promise<Transaction> {
    return api.patch<Transaction>(`/transactions/${id}/reject`, { reason });
  }
};