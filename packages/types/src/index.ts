// Re-export all types for convenience
export * from './api'
export * from './entities'
export * from './enums'

// Commonly used types
export type {
  PaginatedResponse,
  Pagination,
  BaseSearchParams,
  ApiError,
  ErrorResponse
} from './api/common'

export type {
  User,
  UserProfile
} from './entities/user'

export type {
  Supplier,
  SupplierStats
} from './entities/supplier'

export type {
  Product,
  Category,
  ProductStats
} from './entities/product'

export type {
  Inventory,
  StockMovement,
  LowStockAlert,
  InventoryByProduct,
  InventoryStats
} from './entities/inventory'

export type {
  Order,
  OrderItem,
  OrderStats
} from './entities/order'

export type {
  Transaction,
  TransactionItem,
  TransactionStats,
  TransactionSummary,
  TransactionFilters
} from './entities/transaction'

export type {
  GetTransactionsParams,
  GetTransactionsResponse,
  TransactionStatsResponse,
  CreateTransactionRequest,
  CreateTransactionItemRequest,
  UpdateTransactionRequest,
  UpdateTransactionItemRequest,
  GetTransactionResponse,
  DeleteTransactionResponse,
  GetTransactionStatsParams,
  MonthlyTransactionStats,
  PartnerTransactionStats,
  ProductTransactionStats
} from './api/transaction'

export {
  UserRole,
  SupplierStatus,
  ProductStatus,
  OrderStatus,
  MovementType,
  AlertType,
  TransactionType,
  TransactionStatus
} from './enums/status'