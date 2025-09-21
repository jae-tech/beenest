import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  History
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/loading";
import {
  useInventoryStats,
  useLowStockAlerts,
  useAllStockMovements
} from "@/hooks/useInventory";
import type { LowStockAlert, StockMovement } from "@beenest/types";
import { MovementType, AlertType } from "@beenest/types";
import type { StatItem } from "@/types/design-system";
import { type ColumnDef } from "@tanstack/react-table";

const movementTypeLabels: Record<MovementType, string> = {
  [MovementType.IN]: '입고',
  [MovementType.OUT]: '출고',
  [MovementType.ADJUST]: '조정',
  [MovementType.TRANSFER]: '이동'
};

const movementTypeColors: Record<MovementType, string> = {
  [MovementType.IN]: 'bg-green-100 text-green-800',
  [MovementType.OUT]: 'bg-red-100 text-red-800',
  [MovementType.ADJUST]: 'bg-blue-100 text-blue-800',
  [MovementType.TRANSFER]: 'bg-purple-100 text-purple-800'
};

export function InventoryPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'alerts' | 'movements'>('alerts');


  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    error: statsError
  } = useInventoryStats();

  const {
    data: alertsResponse,
    isLoading: isAlertsLoading,
    error: alertsError
  } = useLowStockAlerts();

  const {
    data: movementsResponse,
    isLoading: isMovementsLoading
  } = useAllStockMovements({ page: 1, limit: 20 });

  const stats = statsResponse;
  const alerts = alertsResponse || [];
  const movements = movementsResponse?.data || [];

  // 통계 데이터
  const statItems: StatItem[] = [
    {
      title: "총 재고 가치",
      value: stats ? `₩${stats.totalInventoryValue.toLocaleString()}` : "0",
      description: "전체 재고 가치",
      icon: Package,
      color: "blue",
    },
    {
      title: "정상 재고",
      value: stats?.normalStockCount.toString() || "0",
      description: "정상 재고 상품",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "재고 부족",
      value: stats?.lowStockCount.toString() || "0",
      description: "재고 부족 상품",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      title: "품절",
      value: stats?.outOfStockCount.toString() || "0",
      description: "품절 상품",
      icon: TrendingDown,
      color: "red",
    },
  ];

  // 저재고 알림 테이블 컬럼
  const alertsColumns: ColumnDef<LowStockAlert>[] = [
    {
      accessorKey: "product.productName",
      header: "상품명",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.product.productName}</p>
          <p className="text-sm text-gray-500">{row.original.product.productCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "product.category.categoryName",
      header: "카테고리",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.product.category?.categoryName || "미분류"}
        </span>
      ),
    },
    {
      accessorKey: "inventory.currentStock",
      header: "현재 재고",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.inventory.currentStock}개
        </span>
      ),
    },
    {
      accessorKey: "inventory.minimumStock",
      header: "최소 재고",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-600">
          {row.original.inventory.minimumStock}개
        </span>
      ),
    },
    {
      id: "alertType",
      header: "상태",
      cell: ({ row }) => {
        const alert = row.original.inventory.alertType;
        const colors = {
          [AlertType.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
          [AlertType.REORDER_POINT]: 'bg-orange-100 text-orange-800',
          [AlertType.LOW_STOCK]: 'bg-yellow-100 text-yellow-800'
        };
        const labels = {
          [AlertType.OUT_OF_STOCK]: '품절',
          [AlertType.REORDER_POINT]: '재주문 필요',
          [AlertType.LOW_STOCK]: '재고 부족'
        };

        return (
          <Badge className={`${colors[alert]} text-xs font-medium px-2 py-1 rounded-full`}>
            {labels[alert]}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: `/inventory/${row.original.product.id}/adjust` })}
          >
            재고 조정
          </Button>
          {row.original.preferredSupplier && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/orders/create?supplierId=${row.original.preferredSupplier?.id}&productId=${row.original.product.id}` })}
            >
              발주하기
            </Button>
          )}
        </div>
      ),
    },
  ];

  // 재고 이동 이력 테이블 컬럼
  const movementsColumns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "createdAt",
      header: "일시",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("createdAt")).toLocaleDateString('ko-KR')}
          <br />
          <span className="text-xs text-gray-500">
            {new Date(row.getValue("createdAt")).toLocaleTimeString('ko-KR')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "product.productName",
      header: "상품",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.product?.productName}</p>
          <p className="text-sm text-gray-500">{row.original.product?.productCode}</p>
          {row.original.product?.category && (
            <p className="text-xs text-gray-400">{row.original.product.category.categoryName}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "movementType",
      header: "구분",
      cell: ({ row }) => {
        const type = row.getValue("movementType") as MovementType;
        return (
          <Badge className={`${movementTypeColors[type]} text-xs font-medium px-2 py-1 rounded-full`}>
            {movementTypeLabels[type]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "수량",
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;
        const type = row.original.movementType as MovementType;
        const isPositive = type === 'IN' || (type === 'ADJUST' && quantity > 0);

        return (
          <span className={`font-mono text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : '-'}{Math.abs(quantity)}
          </span>
        );
      },
    },
    {
      accessorKey: "unitCost",
      header: "단가",
      cell: ({ row }) => {
        const unitCost = row.getValue("unitCost") as number | undefined;
        return (
          <span className="font-mono text-sm text-gray-600">
            {unitCost ? `₩${unitCost.toLocaleString()}` : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "메모",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.getValue("notes") || "-"}
        </span>
      ),
    },
    {
      accessorKey: "creator.name",
      header: "담당자",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.creator?.name || "-"}
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="재고 관리"
      actionText="재고 조정"
      stats={statItems}
      onAction={() => navigate({ to: "/inventory/adjust" })}
    >
      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('alerts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'alerts'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>저재고 알림</span>
                {alerts && alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {alerts.length}
                  </Badge>
                )}
              </div>
            </button>
            <button
              onClick={() => setView('movements')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'movements'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>재고 이동 이력</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="space-y-6">
        {view === 'alerts' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">저재고 알림</h3>
            </div>

            {isAlertsLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : alertsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">저재고 알림을 불러오는 중 오류가 발생했습니다.</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">모든 재고가 정상입니다</h3>
                <p className="text-gray-600">현재 재고 부족이나 품절 상품이 없습니다.</p>
              </div>
            ) : (
              <DataTable<LowStockAlert, unknown>
                columns={alertsColumns}
                data={alerts}
                searchKey="product.productName"
                searchPlaceholder="상품명으로 검색..."
              />
            )}
          </Card>
        )}

        {view === 'movements' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">최근 재고 이동 이력</h3>
            </div>

            {isMovementsLoading ? (
              <TableSkeleton rows={10} cols={6} />
            ) : movements.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">재고 이동 이력이 없습니다</h3>
                <p className="text-gray-600">재고 조정을 수행하면 이력이 표시됩니다.</p>
              </div>
            ) : (
              <DataTable<StockMovement, unknown>
                columns={movementsColumns}
                data={movements}
                searchKey="product.productName"
                searchPlaceholder="상품명으로 검색..."
              />
            )}
          </Card>
        )}
      </div>
    </PageLayout>
  );
}