import type { TransactionType, TransactionStatus } from '../enums/status'

// 거래 엔티티 (매입/매출 통합)
export interface Transaction {
  id: string
  transactionNumber: string
  transactionType: TransactionType

  // 거래 상대방 정보
  supplierId?: string
  customerName?: string    // 매출시 고객명
  customerPhone?: string   // 매출시 고객 연락처

  // 거래 일시 및 금액
  transactionDate: string
  subtotalAmount: number   // 공급가액
  vatAmount: number        // 부가세
  totalAmount: number      // 총액

  // 상태 및 메모
  status: TransactionStatus
  notes?: string

  // 메타데이터
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt?: string

  // 관계 데이터
  supplier?: {
    id: string
    companyName: string
    supplierCode: string
    contactPerson?: string
    phone?: string
  }
  creator?: {
    id: string
    name: string
    email: string
  }
  transactionItems?: TransactionItem[]
}

// 거래 품목 엔티티
export interface TransactionItem {
  id: string
  transactionId: string
  productId: string

  // 거래 품목 정보
  quantity: number
  unitPrice: number     // 단가
  totalPrice: number    // 소계 (quantity * unitPrice)
  vatRate: number       // 부가세율 (기본 0.1 = 10%)

  // 관계 데이터
  product?: {
    id: string
    productCode: string
    productName: string
    category?: {
      id: string
      categoryName: string
    }
  }
}

// 거래 통계 정보
export interface TransactionStats {
  // 기간별 통계
  totalPurchases: number     // 총 매입액
  totalSales: number         // 총 매출액
  totalProfit: number        // 총 이익 (매출 - 매입)
  profitMargin: number       // 이익률 (%)

  // 건수 통계
  purchaseCount: number      // 매입 건수
  salesCount: number         // 매출 건수

  // 월별/일별 추이
  monthlyTrend?: Array<{
    period: string           // YYYY-MM
    purchases: number
    sales: number
    profit: number
  }>

  // 상위 거래처
  topSuppliers?: Array<{
    supplierId: string
    companyName: string
    totalAmount: number
    transactionCount: number
  }>
}

// 거래 검색 필터
export interface TransactionFilters {
  transactionType?: TransactionType
  status?: TransactionStatus
  supplierId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  customerName?: string
}

// 거래 요약 정보 (대시보드용)
export interface TransactionSummary {
  // 오늘 거래
  todayPurchases: number
  todaySales: number
  todayProfit: number

  // 이번 달 거래
  monthlyPurchases: number
  monthlySales: number
  monthlyProfit: number

  // 성장률 (전월 대비)
  purchaseGrowth: number     // %
  salesGrowth: number        // %
  profitGrowth: number       // %

  // 최근 거래
  recentTransactions: Array<{
    id: string
    transactionNumber: string
    transactionType: TransactionType
    totalAmount: number
    transactionDate: string
    supplierName?: string
    customerName?: string
  }>
}