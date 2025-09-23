import { useNavigate, useParams } from '@tanstack/react-router'
import { ChevronLeft, Download, Filter, History, Printer, RotateCcw, Search, Eye } from 'lucide-react'
import { useState } from 'react'
import { useProduct } from '@/hooks/useProducts'
import { useStockMovements } from '@/hooks/useInventory'
import type { StockMovement, MovementType } from '@beenest/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DetailPageHeader } from '@/components/layout/DetailPageHeader'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ColumnDef } from '@tanstack/react-table'

export function InventoryHistoryPage() {
  const navigate = useNavigate()
  const { productId } = useParams({ from: '/_layout/inventory/history/$productId' })

  // State for filters
  const [selectedDateRange, setSelectedDateRange] = useState('all')
  const [selectedMovementType, setSelectedMovementType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<StockMovement | null>(null)

  // API hooks
  const { data: productResponse, isLoading: isProductLoading } = useProduct(productId)
  const { data: movementsResponse, isLoading: isMovementsLoading } = useStockMovements(productId)

  const product = productResponse
  const movements = movementsResponse?.data || []
  const isLoading = isProductLoading || isMovementsLoading

  // Helper functions
  const getMovementTypeBadge = (type: MovementType) => {
    switch (type) {
      case 'IN':
        return { label: '입고', variant: 'success' as const }
      case 'OUT':
        return { label: '출고', variant: 'destructive' as const }
      case 'ADJUST':
        return { label: '조정', variant: 'warning' as const }
      case 'TRANSFER':
        return { label: '이동', variant: 'secondary' as const }
      default:
        return { label: '기타', variant: 'secondary' as const }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR')
    }
  }

  const getQuantityChange = (movement: StockMovement) => {
    const { movementType, quantity } = movement
    switch (movementType) {
      case 'IN':
        return `+${quantity}`
      case 'OUT':
        return `-${quantity}`
      case 'ADJUST':
        return `${quantity > 0 ? '+' : ''}${quantity}`
      default:
        return quantity.toString()
    }
  }

  // Filter data
  const filteredMovements = movements.filter((movement) => {
    const matchesMovementType = selectedMovementType === 'all' || movement.movementType === selectedMovementType
    const matchesSearch = searchTerm === '' ||
      movement.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesMovementType && matchesSearch
  })

  // Table columns
  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: 'createdAt',
      header: '날짜/시간',
      cell: ({ row }) => {
        const { date, time } = formatDate(row.original.createdAt)
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{date}</div>
            <div className="text-gray-500 text-xs">{time}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'movementType',
      header: '유형',
      cell: ({ row }) => {
        const badge = getMovementTypeBadge(row.original.movementType)
        return (
          <Badge variant={badge.variant} className="text-xs">
            {badge.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'quantity',
      header: '수량 변경',
      cell: ({ row }) => {
        const quantityChange = getQuantityChange(row.original)
        const isPositive = quantityChange.startsWith('+')
        const isNegative = quantityChange.startsWith('-')

        return (
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-900'
          }`}>
            {quantityChange}개
          </div>
        )
      }
    },
    {
      accessorKey: 'reason',
      header: '사유',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {row.original.reason || '-'}
        </div>
      )
    },
    {
      accessorKey: 'previousStock',
      header: '이전 재고',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {row.original.previousStock}개
        </div>
      )
    },
    {
      accessorKey: 'newStock',
      header: '변경 후 재고',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 bg-blue-50 px-2 py-1 rounded text-xs font-mono border border-blue-200">
          {row.original.newStock}개
        </div>
      )
    },
    {
      accessorKey: 'createdBy',
      header: '변경자',
      cell: ({ row }) => {
        const createdBy = row.original.createdBy
        if (!createdBy) return <span className="text-gray-500 text-sm">-</span>

        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {createdBy.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">{`User ${createdBy.slice(-4)}`}</div>
              <div className="text-gray-500 text-xs">사용자</div>
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: '상세',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRecord(row.original)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ]

  const handleExport = () => {
    // 내보내기 로직 구현
    console.log('Exporting data...')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResetFilters = () => {
    setSelectedDateRange('all')
    setSelectedMovementType('all')
    setSearchTerm('')
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">재고 이력을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <DetailPageHeader
        backPath="/products"
        breadcrumbs={[
          { label: '상품 관리', path: '/products' },
          { label: product?.productName || '상품 상세', path: `/products/${productId}` },
          { label: '재고 변경 이력' }
        ]}
        title={`재고 변경 이력 - ${product?.productName || '상품'}`}
        subtitle="상품의 모든 재고 변경사항과 수정 내역을 확인하세요"
        imageUrl={product?.imageUrl || "https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20shot%20on%20clean%20white%20background%20minimal%20ecommerce%20style%20professional%20product%20photography%20modern%20design&width=200&height=200&seq=history-product-main&orientation=squarish"}
        imageAlt={product?.productName || '상품 이미지'}
        badges={[
          { label: `SKU: ${product?.productCode || 'N/A'}`, variant: 'default' },
          { label: `총 ${filteredMovements.length}건의 변경사항`, variant: 'secondary' }
        ]}
        rightInfo={{
          label: '조회 기간',
          value: '2024년 1월 1일 - 현재',
          sublabel: '실시간 업데이트'
        }}
        actions={[
          {
            label: '내보내기',
            icon: Download,
            onClick: handleExport,
            variant: 'outline'
          },
          {
            label: '인쇄',
            icon: Printer,
            onClick: handlePrint,
            variant: 'outline'
          }
        ]}
      />

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="사유, 변경자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range Filter */}
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기간</SelectItem>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="week">최근 1주일</SelectItem>
                <SelectItem value="month">최근 1개월</SelectItem>
                <SelectItem value="quarter">최근 3개월</SelectItem>
              </SelectContent>
            </Select>

            {/* Movement Type Filter */}
            <Select value={selectedMovementType} onValueChange={setSelectedMovementType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="변경 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="IN">입고</SelectItem>
                <SelectItem value="OUT">출고</SelectItem>
                <SelectItem value="ADJUST">조정</SelectItem>
                <SelectItem value="TRANSFER">이동</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>총 {filteredMovements.length}건</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <History className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">재고 변경 이력</h2>
        </div>

        <DataTable
          columns={columns}
          data={filteredMovements}
        />
      </Card>

      {/* Detail Modal */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                재고 변경 상세 정보
              </DialogTitle>
              <DialogDescription>
                재고 변경에 대한 자세한 정보를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    변경 일시
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-900">
                      {formatDate(selectedRecord.createdAt).date} {formatDate(selectedRecord.createdAt).time}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    변경 유형
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Badge variant={getMovementTypeBadge(selectedRecord.movementType).variant}>
                      {getMovementTypeBadge(selectedRecord.movementType).label}
                    </Badge>
                  </div>
                </div>
                {selectedRecord.createdBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      변경자
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {selectedRecord.createdBy.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{`User ${selectedRecord.createdBy.slice(-4)}`}</p>
                          <p className="text-gray-500 text-xs">사용자</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    변경 사유
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-900">{selectedRecord.reason || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Stock Changes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  재고 변경 내용
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        이전 재고
                      </label>
                      <div className="p-3 bg-white rounded border">
                        <span className="text-sm text-gray-800 font-mono">
                          {selectedRecord.previousStock}개
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        수량 변경
                      </label>
                      <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        <span className="text-sm text-gray-900 font-medium font-mono">
                          {getQuantityChange(selectedRecord)}개
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        변경 후 재고
                      </label>
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <span className="text-sm text-gray-900 font-medium font-mono">
                          {selectedRecord.newStock}개
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Info */}
              {selectedRecord.referenceId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    참조 정보
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                          참조 유형
                        </label>
                        <div className="p-3 bg-white rounded border">
                          <span className="text-sm text-gray-800">
                            {selectedRecord.referenceType || '-'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                          참조 ID
                        </label>
                        <div className="p-3 bg-white rounded border">
                          <span className="text-sm text-gray-800 font-mono">
                            {selectedRecord.referenceId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                닫기
              </Button>
              <Button
                onClick={handleExport}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                상세 내역 다운로드
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}