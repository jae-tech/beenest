import { TransactionType, TransactionStatus } from '../enums/status';
import { Transaction, TransactionItem } from '../entities/transaction';

// 거래 목록 조회 요청 파라미터
export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  customerName?: string;
  productId?: string;
}

// 거래 목록 조회 응답
export interface GetTransactionsResponse {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 거래 통계 응답
export interface TransactionStatsResponse {
  totalSales: number;
  totalPurchases: number;
  totalProfit: number;
  profitMargin: number;
  thisMonthSales: number;
  thisMonthPurchases: number;
  pendingTransactionsCount: number;
  totalTransactionsCount: number;
}

// 거래 생성 요청
export interface CreateTransactionRequest {
  transactionType: TransactionType;
  transactionDate: string;
  supplierId?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  items: CreateTransactionItemRequest[];
}

// 거래 품목 생성 요청
export interface CreateTransactionItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

// 거래 수정 요청
export interface UpdateTransactionRequest {
  transactionType?: TransactionType;
  transactionDate?: string;
  supplierId?: string;
  customerName?: string;
  customerPhone?: string;
  status?: TransactionStatus;
  notes?: string;
  items?: UpdateTransactionItemRequest[];
}

// 거래 품목 수정 요청
export interface UpdateTransactionItemRequest {
  id?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

// 거래 상세 조회 응답
export interface GetTransactionResponse {
  data: Transaction & {
    supplier?: {
      id: string;
      companyName: string;
      contactPerson: string;
      phone: string;
    };
    items: (TransactionItem & {
      product: {
        id: string;
        productName: string;
        productCode: string;
        unitPrice: number;
      };
    })[];
  };
}

// 거래 삭제 응답
export interface DeleteTransactionResponse {
  success: boolean;
  message: string;
}

// 거래 통계 조회 요청 파라미터
export interface GetTransactionStatsParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// 월별 거래 통계
export interface MonthlyTransactionStats {
  month: string;
  salesAmount: number;
  purchaseAmount: number;
  profit: number;
  transactionCount: number;
}

// 거래처별 통계
export interface PartnerTransactionStats {
  partnerId: string;
  partnerName: string;
  transactionType: TransactionType;
  totalAmount: number;
  transactionCount: number;
  lastTransactionDate: string;
}

// 상품별 거래 통계
export interface ProductTransactionStats {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalQuantityPurchased: number;
  totalSalesAmount: number;
  totalPurchaseAmount: number;
  profit: number;
  profitMargin: number;
}