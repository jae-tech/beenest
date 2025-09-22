import { queryKeys } from "@/lib/query-client";
import { handleApiError, handleApiSuccess } from "@/lib/toast";
import { transactionsService } from "@/services/transactions.service";
import type {
  GetTransactionsParams,
  TransactionStatsResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  GetTransactionStatsParams,
  MonthlyTransactionStats,
  PartnerTransactionStats,
  ProductTransactionStats,
  Transaction
} from "@beenest/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 거래 목록 조회
export function useTransactions(params?: GetTransactionsParams) {
  return useQuery({
    queryKey: ['transactions', 'list', params],
    queryFn: () => transactionsService.getTransactions(params),
    enabled: true,
  });
}

// 거래 상세 조회
export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', 'detail', id],
    queryFn: () => transactionsService.getTransaction(id),
    enabled: !!id,
  });
}

// 거래 통계 조회
export function useTransactionStats(params?: GetTransactionStatsParams) {
  return useQuery({
    queryKey: ['transactions', 'stats', params],
    queryFn: () => transactionsService.getTransactionStats(params),
    enabled: true,
  });
}

// 월별 거래 통계
export function useMonthlyTransactionStats(params?: GetTransactionStatsParams) {
  return useQuery({
    queryKey: ['transactions', 'stats', 'monthly', params],
    queryFn: () => transactionsService.getMonthlyStats(params),
    enabled: true,
  });
}

// 거래처별 통계
export function usePartnerTransactionStats(params?: GetTransactionStatsParams) {
  return useQuery({
    queryKey: ['transactions', 'stats', 'partners', params],
    queryFn: () => transactionsService.getPartnerStats(params),
    enabled: true,
  });
}

// 상품별 거래 통계
export function useProductTransactionStats(params?: GetTransactionStatsParams) {
  return useQuery({
    queryKey: ['transactions', 'stats', 'products', params],
    queryFn: () => transactionsService.getProductStats(params),
    enabled: true,
  });
}

// 거래 생성
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsService.createTransaction(data),
    onSuccess: (data) => {
      handleApiSuccess('거래가 성공적으로 등록되었습니다.');
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      handleApiError(error, '거래 등록에 실패했습니다.');
    },
  });
}

// 거래 수정
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionsService.updateTransaction(id, data),
    onSuccess: (data) => {
      handleApiSuccess('거래가 성공적으로 수정되었습니다.');
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', data.id] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      handleApiError(error, '거래 수정에 실패했습니다.');
    },
  });
}

// 거래 삭제
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      handleApiSuccess('거래가 성공적으로 삭제되었습니다.');
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      handleApiError(error, '거래 삭제에 실패했습니다.');
    },
  });
}

// 거래 상태 변경
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      transactionsService.updateTransactionStatus(id, status),
    onSuccess: (data) => {
      handleApiSuccess('거래 상태가 성공적으로 변경되었습니다.');
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', data.id] });
    },
    onError: (error) => {
      handleApiError(error, '거래 상태 변경에 실패했습니다.');
    },
  });
}

// 거래 복제
export function useDuplicateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.duplicateTransaction(id),
    onSuccess: () => {
      handleApiSuccess('거래가 성공적으로 복제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      handleApiError(error, '거래 복제에 실패했습니다.');
    },
  });
}

// 거래 승인
export function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.approveTransaction(id),
    onSuccess: (data) => {
      handleApiSuccess('거래가 승인되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', data.id] });
    },
    onError: (error) => {
      handleApiError(error, '거래 승인에 실패했습니다.');
    },
  });
}

// 거래 반려
export function useRejectTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      transactionsService.rejectTransaction(id, reason),
    onSuccess: (data) => {
      handleApiSuccess('거래가 반려되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', data.id] });
    },
    onError: (error) => {
      handleApiError(error, '거래 반려에 실패했습니다.');
    },
  });
}

// 거래 내보내기
export function useExportTransactions() {
  return useMutation({
    mutationFn: ({ params, format }: { params?: GetTransactionsParams; format?: 'excel' | 'csv' }) =>
      transactionsService.exportTransactions(params, format),
    onSuccess: (blob, variables) => {
      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.${variables.format || 'excel'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      handleApiSuccess('거래 데이터를 성공적으로 내보냈습니다.');
    },
    onError: (error) => {
      handleApiError(error, '거래 데이터 내보내기에 실패했습니다.');
    },
  });
}

// 거래 가져오기
export function useImportTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => transactionsService.importTransactions(file),
    onSuccess: (result) => {
      if (result.success > 0) {
        handleApiSuccess(`${result.success}건의 거래를 성공적으로 가져왔습니다.`);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
      if (result.failed > 0) {
        console.warn('Import errors:', result.errors);
      }
    },
    onError: (error) => {
      handleApiError(error, '거래 데이터 가져오기에 실패했습니다.');
    },
  });
}