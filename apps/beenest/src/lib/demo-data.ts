// 데모 데이터 및 초기 데이터 생성을 위한 유틸리티
import type { Product, Supplier, Order } from '@/types/api'

export const demoCategories = [
  { id: '1', name: '전자제품', description: '전자기기 및 관련 부품' },
  { id: '2', name: '의류', description: '의류 및 패션 아이템' },
  { id: '3', name: '생활용품', description: '일상생활에 필요한 용품' },
  { id: '4', name: '사무용품', description: '사무실에서 사용하는 용품' },
  { id: '5', name: '식품', description: '음식 및 음료' },
]

export const demoSuppliers: Partial<Supplier>[] = [
  {
    id: '1',
    supplierCode: 'SUP001',
    companyName: '㈜글로벌테크',
    contactPerson: '김철수',
    email: 'contact@globaltech.com',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    website: 'https://globaltech.com',
    supplierStatus: 'ACTIVE' as any,
    rating: 4.5,
    notes: '전자제품 전문 공급업체',
  },
  {
    id: '2',
    supplierCode: 'SUP002',
    companyName: '한국패션㈜',
    contactPerson: '박영희',
    email: 'sales@kfashion.co.kr',
    phone: '02-2345-6789',
    address: '서울시 동대문구 동대문로 456',
    website: 'https://kfashion.co.kr',
    supplierStatus: 'ACTIVE' as any,
    rating: 4.2,
    notes: '의류 및 패션 아이템 공급업체',
  },
  {
    id: '3',
    supplierCode: 'SUP003',
    companyName: '생활가전㈜',
    contactPerson: '이민수',
    email: 'info@lifehome.com',
    phone: '031-3456-7890',
    address: '경기도 수원시 영통구 월드컵로 789',
    website: 'https://lifehome.com',
    supplierStatus: 'ACTIVE' as any,
    rating: 4.8,
    notes: '생활용품 및 가전제품 전문',
  },
]

export const demoProducts: Partial<Product>[] = [
  {
    id: '1',
    productCode: 'PRD001',
    productName: '무선 블루투스 이어폰',
    description: '고음질 무선 이어폰, 노이즈 캔슬링 기능',
    categoryId: '1',
    unitPrice: 89000,
    costPrice: 65000,
    barcode: '8801234567890',
    weight: 0.05,
    dimensions: '5x3x2cm',
    status: 'ACTIVE' as any,
    inventory: {
      id: '1',
      productId: '1',
      currentStock: 150,
      reservedStock: 10,
      minimumStock: 20,
      reorderPoint: 30,
      availableStock: 140,
    },
  },
  {
    id: '2',
    productCode: 'PRD002',
    productName: '스마트워치',
    description: '건강 모니터링 및 알림 기능이 있는 스마트워치',
    categoryId: '1',
    unitPrice: 299000,
    costPrice: 220000,
    barcode: '8801234567891',
    weight: 0.08,
    dimensions: '4x4x1cm',
    status: 'ACTIVE' as any,
    inventory: {
      id: '2',
      productId: '2',
      currentStock: 85,
      reservedStock: 5,
      minimumStock: 15,
      reorderPoint: 25,
      availableStock: 80,
    },
  },
  {
    id: '3',
    productCode: 'PRD003',
    productName: '캐주얼 티셔츠',
    description: '100% 코튼 소재의 편안한 캐주얼 티셔츠',
    categoryId: '2',
    unitPrice: 29000,
    costPrice: 18000,
    barcode: '8801234567892',
    weight: 0.2,
    dimensions: '30x40x2cm',
    status: 'ACTIVE' as any,
    inventory: {
      id: '3',
      productId: '3',
      currentStock: 200,
      reservedStock: 15,
      minimumStock: 50,
      reorderPoint: 80,
      availableStock: 185,
    },
  },
  {
    id: '4',
    productCode: 'PRD004',
    productName: '스테인리스 텀블러',
    description: '보온/보냉 기능이 있는 스테인리스 텀블러',
    categoryId: '3',
    unitPrice: 25000,
    costPrice: 15000,
    barcode: '8801234567893',
    weight: 0.3,
    dimensions: '8x8x20cm',
    status: 'ACTIVE' as any,
    inventory: {
      id: '4',
      productId: '4',
      currentStock: 120,
      reservedStock: 8,
      minimumStock: 30,
      reorderPoint: 50,
      availableStock: 112,
    },
  },
  {
    id: '5',
    productCode: 'PRD005',
    productName: '노트북 스탠드',
    description: '각도 조절 가능한 알루미늄 노트북 스탠드',
    categoryId: '4',
    unitPrice: 45000,
    costPrice: 30000,
    barcode: '8801234567894',
    weight: 0.8,
    dimensions: '25x20x5cm',
    status: 'ACTIVE' as any,
    inventory: {
      id: '5',
      productId: '5',
      currentStock: 75,
      reservedStock: 3,
      minimumStock: 20,
      reorderPoint: 35,
      availableStock: 72,
    },
  },
]

// 데모 주문 데이터
export const demoOrders: Partial<Order>[] = [
  {
    id: '1',
    orderNumber: 'ORD-20240922-001',
    supplierId: '1',
    status: 'PENDING' as any,
    orderDate: '2024-09-22',
    expectedDeliveryDate: '2024-09-25',
    totalAmount: 650000,
    notes: '무선 이어폰 50개 주문',
    supplier: {
      id: '1',
      companyName: '㈜글로벌테크',
      supplierCode: 'SUP001',
    },
    orderItems: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        quantity: 50,
        unitPrice: 65000,
        totalPrice: 3250000,
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-20240922-002',
    supplierId: '2',
    status: 'CONFIRMED' as any,
    orderDate: '2024-09-21',
    expectedDeliveryDate: '2024-09-24',
    totalAmount: 540000,
    notes: '캐주얼 티셔츠 30개 주문',
    supplier: {
      id: '2',
      companyName: '한국패션㈜',
      supplierCode: 'SUP002',
    },
    orderItems: [
      {
        id: '2',
        orderId: '2',
        productId: '3',
        quantity: 30,
        unitPrice: 18000,
        totalPrice: 540000,
      },
    ],
  },
]

// 데모 거래 데이터 (매입/매출)
export const demoTransactions = [
  {
    id: 'txn-1',
    transactionNumber: 'TXN-2024-001',
    type: 'PURCHASE', // 매입
    productId: 'product-1',
    productName: '무선 블루투스 이어폰',
    supplierId: 'supplier-1',
    supplierName: '테크놀로지 공급업체',
    quantity: 50,
    unitPrice: 65000,
    totalAmount: 3250000,
    status: 'COMPLETED',
    transactionDate: '2024-01-15',
    notes: '신제품 매입',
  },
  {
    id: 'txn-2',
    transactionNumber: 'TXN-2024-002',
    type: 'SALE', // 매출
    productId: 'product-1',
    productName: '무선 블루투스 이어폰',
    customerId: 'customer-1',
    customerName: '김고객',
    quantity: 20,
    unitPrice: 89000,
    totalAmount: 1780000,
    status: 'COMPLETED',
    transactionDate: '2024-01-18',
    notes: '온라인 판매',
  },
  {
    id: 'txn-3',
    transactionNumber: 'TXN-2024-003',
    type: 'PURCHASE', // 매입
    productId: 'product-2',
    productName: '스마트 워치',
    supplierId: 'supplier-2',
    supplierName: '전자제품 유통사',
    quantity: 30,
    unitPrice: 22000,
    totalAmount: 660000,
    status: 'COMPLETED',
    transactionDate: '2024-01-20',
    notes: '정기 보충',
  },
  {
    id: 'txn-4',
    transactionNumber: 'TXN-2024-004',
    type: 'SALE', // 매출
    productId: 'product-2',
    productName: '스마트 워치',
    customerId: 'customer-2',
    customerName: '박고객',
    quantity: 15,
    unitPrice: 32000,
    totalAmount: 480000,
    status: 'COMPLETED',
    transactionDate: '2024-01-22',
    notes: '매장 판매',
  },
  {
    id: 'txn-5',
    transactionNumber: 'TXN-2024-005',
    type: 'SALE', // 매출
    productId: 'product-3',
    productName: '휴대용 충전기',
    customerId: 'customer-3',
    customerName: '이고객',
    quantity: 25,
    unitPrice: 45000,
    totalAmount: 1125000,
    status: 'PENDING',
    transactionDate: '2024-01-25',
    notes: '대량 주문',
  },
  {
    id: 'txn-6',
    transactionNumber: 'TXN-2024-006',
    type: 'PURCHASE', // 매입
    productId: 'product-4',
    productName: '노트북 거치대',
    supplierId: 'supplier-3',
    supplierName: '사무용품 전문점',
    quantity: 40,
    unitPrice: 28000,
    totalAmount: 1120000,
    status: 'COMPLETED',
    transactionDate: '2024-01-28',
    notes: '사무용품 보충',
  },
  {
    id: 'txn-7',
    transactionNumber: 'TXN-2024-007',
    type: 'SALE', // 매출
    productId: 'product-4',
    productName: '노트북 거치대',
    customerId: 'customer-4',
    customerName: '최고객',
    quantity: 12,
    unitPrice: 39000,
    totalAmount: 468000,
    status: 'COMPLETED',
    transactionDate: '2024-02-01',
    notes: '기업 납품',
  },
  {
    id: 'txn-8',
    transactionNumber: 'TXN-2024-008',
    type: 'SALE', // 매출
    productId: 'product-5',
    productName: '블루투스 스피커',
    customerId: 'customer-5',
    customerName: '정고객',
    quantity: 8,
    unitPrice: 75000,
    totalAmount: 600000,
    status: 'COMPLETED',
    transactionDate: '2024-02-03',
    notes: '프리미엄 제품 판매',
  },
]

// 로컬 스토리지에 데모 데이터 저장
export const initializeDemoData = () => {
  if (!localStorage.getItem('demo-initialized')) {
    localStorage.setItem('demo-categories', JSON.stringify(demoCategories))
    localStorage.setItem('demo-suppliers', JSON.stringify(demoSuppliers))
    localStorage.setItem('demo-products', JSON.stringify(demoProducts))
    localStorage.setItem('demo-orders', JSON.stringify(demoOrders))
    localStorage.setItem('demo-transactions', JSON.stringify(demoTransactions))
    localStorage.setItem('demo-initialized', 'true')
    console.log('✅ 데모 데이터가 초기화되었습니다')
  }
}

// 데모 데이터 조회 함수들
export const getDemoCategories = () => {
  const stored = localStorage.getItem('demo-categories')
  return stored ? JSON.parse(stored) : demoCategories
}

export const getDemoSuppliers = () => {
  const stored = localStorage.getItem('demo-suppliers')
  return stored ? JSON.parse(stored) : demoSuppliers
}

export const getDemoProducts = () => {
  const stored = localStorage.getItem('demo-products')
  return stored ? JSON.parse(stored) : demoProducts
}

export const getDemoOrders = () => {
  const stored = localStorage.getItem('demo-orders')
  return stored ? JSON.parse(stored) : demoOrders
}

export const getDemoTransactions = () => {
  const stored = localStorage.getItem('demo-transactions')
  return stored ? JSON.parse(stored) : demoTransactions
}

// 새 데이터 추가 함수들
export const addDemoProduct = (product: Partial<Product>) => {
  const products = getDemoProducts()
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    productCode: `PRD${String(products.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  localStorage.setItem('demo-products', JSON.stringify(products))
  return newProduct
}

export const addDemoSupplier = (supplier: Partial<Supplier>) => {
  const suppliers = getDemoSuppliers()
  const newSupplier = {
    ...supplier,
    id: Date.now().toString(),
    supplierCode: supplier.supplierCode || `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  suppliers.push(newSupplier)
  localStorage.setItem('demo-suppliers', JSON.stringify(suppliers))
  return newSupplier
}

export const addDemoOrder = (order: Partial<Order>) => {
  const orders = getDemoOrders()
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    orderNumber: order.orderNumber || `ORD-${today}-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  localStorage.setItem('demo-orders', JSON.stringify(orders))
  return newOrder
}

export const addDemoTransaction = (transaction: any) => {
  const transactions = getDemoTransactions()
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    transactionNumber: transaction.transactionNumber || `TXN-${today}-${String(transactions.length + 1).padStart(3, '0')}`,
    transactionDate: transaction.transactionDate || new Date().toISOString().slice(0, 10),
    status: transaction.status || 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  localStorage.setItem('demo-transactions', JSON.stringify(transactions))
  return newTransaction
}

// 데모 데이터 업데이트 함수들
export const updateDemoProduct = (id: string, updates: Partial<Product>) => {
  const products = getDemoProducts()
  const index = products.findIndex((p: any) => p.id === id)
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('demo-products', JSON.stringify(products))
    return products[index]
  }
  return null
}

export const updateDemoSupplier = (id: string, updates: Partial<Supplier>) => {
  const suppliers = getDemoSuppliers()
  const index = suppliers.findIndex((s: any) => s.id === id)
  if (index !== -1) {
    suppliers[index] = {
      ...suppliers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('demo-suppliers', JSON.stringify(suppliers))
    return suppliers[index]
  }
  return null
}

export const updateDemoTransaction = (id: string, updates: any) => {
  const transactions = getDemoTransactions()
  const index = transactions.findIndex((t: any) => t.id === id)
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('demo-transactions', JSON.stringify(transactions))
    return transactions[index]
  }
  return null
}

// 데모 데이터 삭제 함수들
export const deleteDemoProduct = (id: string) => {
  const products = getDemoProducts()
  const filtered = products.filter((p: any) => p.id !== id)
  localStorage.setItem('demo-products', JSON.stringify(filtered))
  return true
}

export const deleteDemoSupplier = (id: string) => {
  const suppliers = getDemoSuppliers()
  const filtered = suppliers.filter((s: any) => s.id !== id)
  localStorage.setItem('demo-suppliers', JSON.stringify(filtered))
  return true
}

export const deleteDemoTransaction = (id: string) => {
  const transactions = getDemoTransactions()
  const filtered = transactions.filter((t: any) => t.id !== id)
  localStorage.setItem('demo-transactions', JSON.stringify(filtered))
  return true
}

// 데모 데이터 리셋
export const resetDemoData = () => {
  localStorage.removeItem('demo-categories')
  localStorage.removeItem('demo-suppliers')
  localStorage.removeItem('demo-products')
  localStorage.removeItem('demo-orders')
  localStorage.removeItem('demo-transactions')
  localStorage.removeItem('demo-initialized')
  initializeDemoData()
  console.log('🔄 데모 데이터가 리셋되었습니다')
}