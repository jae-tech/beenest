import { useState, useRef, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { InventoryItem } from '../stores/inventoryStore'
import { Image, Edit, Eye, Trash2 } from 'lucide-react'

interface InventoryTableProps {
  items: InventoryItem[]
  sortBy?: keyof InventoryItem
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: keyof InventoryItem) => void
  onItemClick?: (item: InventoryItem) => void
  selectedItems?: string[]
  onSelectItem?: (itemId: string) => void
  onSelectAll?: () => void
  className?: string
}

const SortIcon = ({ direction }: { direction?: 'asc' | 'desc' }) => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {direction === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : direction === 'desc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    )}
  </svg>
)

const StockStatusBadge = ({ quantity, lowStockThreshold }: { quantity: number; lowStockThreshold: number }) => {
  const status = quantity === 0 ? 'out' : quantity <= lowStockThreshold ? 'low' : 'normal'

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        status === 'out'
          ? 'bg-red-100 text-red-800'
          : status === 'low'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {status === 'out' ? '품절' : status === 'low' ? '부족' : '정상'}
    </span>
  )
}

const TableHeader = ({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
  className = '',
}: {
  label: string
  field: keyof InventoryItem
  sortBy?: keyof InventoryItem
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: keyof InventoryItem) => void
  className?: string
}) => (
  <th
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${className}`}
    onClick={() => onSort?.(field)}
  >
    <div className="flex items-center">
      {label}
      <SortIcon direction={sortBy === field ? sortOrder : undefined} />
    </div>
  </th>
)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

export const InventoryTable = ({
  items,
  sortBy,
  sortOrder,
  onSort,
  onItemClick,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  className = '',
}: InventoryTableProps) => {
  const [selectAll, setSelectAll] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  // Virtual scrolling을 위한 설정
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // 각 행의 예상 높이 (px)
    overscan: 10, // 미리 렌더링할 행의 개수
  })

  useEffect(() => {
    const allSelected = items.length > 0 && selectedItems.length === items.length
    setSelectAll(allSelected)
  }, [selectedItems, items])

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    onSelectAll?.()
  }

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-4v4a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">재고가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">검색 조건을 변경하거나 새 상품을 추가해보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <TableHeader
              label="Product"
              field="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHeader
              label="SKU"
              field="sku"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHeader
              label="Category"
              field="category"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHeader
              label="Stock Level"
              field="quantity"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHeader
              label="Unit Price"
              field="price"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
              Total Value
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              name: "Wireless Headphones",
              sku: "WH-001",
              category: "Electronics",
              stock: 245,
              price: 89.99,
              status: "In Stock",
              statusColor: "bg-green-100 text-green-800",
            },
            {
              name: "Cotton T-Shirt",
              sku: "CT-002",
              category: "Apparel",
              stock: 15,
              price: 24.99,
              status: "Low Stock",
              statusColor: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "Laptop Backpack",
              sku: "LB-003",
              category: "Accessories",
              stock: 0,
              price: 49.99,
              status: "Out of Stock",
              statusColor: "bg-red-100 text-red-800",
            },
            {
              name: "Bluetooth Speaker",
              sku: "BS-004",
              category: "Electronics",
              stock: 128,
              price: 79.99,
              status: "In Stock",
              statusColor: "bg-green-100 text-green-800",
            },
            {
              name: "Running Shoes",
              sku: "RS-005",
              category: "Footwear",
              stock: 67,
              price: 129.99,
              status: "In Stock",
              statusColor: "bg-green-100 text-green-800",
            },
          ].map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <Image className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-sm font-mono text-gray-900">
                {item.sku}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {item.category}
              </td>
              <td className="py-4 px-4 text-sm font-medium text-gray-900">
                {item.stock} units
              </td>
              <td className="py-4 px-4 text-sm font-medium text-gray-900">
                ${item.price}
              </td>
              <td className="py-4 px-4 text-sm font-medium text-gray-900">
                ${(item.stock * item.price).toLocaleString()}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`${item.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button className="border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Edit className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Eye className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="border border-gray-200 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}