import { PageLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/loading";
import { useTransactions, useTransactionStats } from "@/hooks/useTransactions";
import { TransactionType, TransactionStatus, GetTransactionsParams } from "@beenest/types";
import type { StatItem } from "@/types/design-system";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DollarSign, TrendingUp, TrendingDown, Percent, Edit, Eye, Receipt } from "lucide-react";
import TransactionModal from "./TransactionModal";

// 거래 타입 정의 (임시 - 실제 API 타입과 맞춰야 함)
interface Transaction {
  id: string;
  transactionNumber: string;
  transactionDate: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  customerName?: string;
  supplier?: {
    companyName: string;
  };
  items?: {
    product?: {
      productName: string;
    };
    quantity: number;
    unitPrice: string;
  }[];
  totalAmount: string;
}

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [searchParams] = useState({});

  // API 호출
  const { data: transactionsData, isLoading, error } = useTransactions(searchParams);
  const { data: statsData, isLoading: statsLoading } = useTransactionStats();

  // 거래 목록 (실제 API 데이터 우선, 없으면 빈 배열)
  const transactions: Transaction[] = transactionsData?.data || [];
  const totalTransactions = transactionsData?.pagination?.total || 0;

  // 임시 목업 데이터 (백엔드 연결 전까지 사용)
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      transactionNumber: "SAL-20241201-001",
      transactionDate: "2024-12-01",
      customerName: "홍길동 고객",
      totalAmount: "1250000",
      transactionType: TransactionType.SALE,
      status: TransactionStatus.CONFIRMED,
      items: [{
        product: { productName: "프리미엄 원두커피 1kg" },
        quantity: 10,
        unitPrice: "125000"
      }]
    },
    {
      id: "2",
      transactionNumber: "PUR-20241130-002",
      transactionDate: "2024-11-30",
      supplier: { companyName: "㈜한국자재" },
      totalAmount: "890000",
      transactionType: TransactionType.PURCHASE,
      status: TransactionStatus.CONFIRMED,
      items: [{
        product: { productName: "스테인리스 보온병 500ml" },
        quantity: 50,
        unitPrice: "17800"
      }]
    },
    {
      id: "3",
      transactionNumber: "SAL-20241129-003",
      transactionDate: "2024-11-29",
      customerName: "ABC마트",
      totalAmount: "2100000",
      transactionType: TransactionType.SALE,
      status: TransactionStatus.PENDING,
      items: [{
        product: { productName: "유기농 녹차 티백 100개입" },
        quantity: 100,
        unitPrice: "21000"
      }]
    }
  ];

  // 데이터가 없으면 목업 데이터 사용
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? Number(amount) : amount;
    return `₩${numAmount.toLocaleString('ko-KR')}`;
  };

  // 통계 데이터 (API 우선, 로딩 중에는 기본값)
  const statsValues = statsData || {
    totalSales: 0,
    totalPurchases: 0,
    totalProfit: 0,
    profitMargin: 0,
    thisMonthSales: 0,
    thisMonthPurchases: 0,
  };

  const stats: StatItem[] = [
    {
      title: "매출 총이익",
      value: formatCurrency(statsValues.totalProfit),
      description: "총매출액 - 총매입액",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "이번 달 매출액",
      value: formatCurrency(statsValues.thisMonthSales),
      description: `${new Date().getMonth() + 1}월 매출 합계`,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "이번 달 매입액",
      value: formatCurrency(statsValues.thisMonthPurchases),
      description: `${new Date().getMonth() + 1}월 매입 합계`,
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "수익률",
      value: `${statsValues.profitMargin.toFixed(1)}%`,
      description: "(총이익/총매출) × 100",
      icon: Percent,
      color: "purple",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "확정";
      case "PENDING":
        return "대기";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

  const getTransactionTypeText = (type: string) => {
    return type === "SALE" ? "매출" : "매입";
  };

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    if (confirm("정말로 이 거래를 삭제하시겠습니까?")) {
      console.log("삭제할 거래 ID:", transactionId);
      // 실제로는 API 호출로 삭제 처리
    }
  };

  const handleSaveTransaction = (transactionData: any) => {
    console.log("저장할 거래 데이터:", transactionData);
    // 실제로는 API 호출로 저장 처리
  };

  // DataTable 컬럼 정의
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "transactionNumber",
      header: "거래번호",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {new Date(row.original.transactionDate).toLocaleDateString('ko-KR')}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {row.getValue("transactionNumber")}
          </div>
        </div>
      ),
    },
    {
      id: "party",
      header: "거래처",
      cell: ({ row }) => {
        const transaction = row.original;
        const partyName = transaction.supplier?.companyName || transaction.customerName || "정보 없음";
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
            {partyName}
          </Badge>
        );
      },
    },
    {
      id: "product",
      header: "품목",
      cell: ({ row }) => {
        const transaction = row.original;
        const firstItem = transaction.items?.[0];
        return (
          <div className="text-sm font-medium text-gray-900">
            {firstItem?.product?.productName || "정보 없음"}
            {transaction.items && transaction.items.length > 1 && (
              <span className="text-xs text-gray-500 ml-1">
                외 {transaction.items.length - 1}건
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "quantity",
      header: "수량",
      cell: ({ row }) => {
        const transaction = row.original;
        const totalQuantity = transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        return (
          <div className="text-sm font-medium text-gray-900">
            {totalQuantity}개
          </div>
        );
      },
    },
    {
      id: "amount",
      header: "단가/합계",
      cell: ({ row }) => {
        const transaction = row.original;
        const firstItem = transaction.items?.[0];
        return (
          <div>
            {firstItem && (
              <div className="text-sm text-gray-600">
                단가: {formatCurrency(firstItem.unitPrice)}
              </div>
            )}
            <div className="text-sm font-bold">
              <span
                className={
                  transaction.transactionType === TransactionType.SALE
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {transaction.transactionType === TransactionType.SALE ? "+" : "-"}
                {formatCurrency(transaction.totalAmount)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "transactionType",
      header: "거래유형",
      cell: ({ row }) => {
        const type = row.getValue("transactionType") as TransactionType;
        return (
          <Badge
            className={`${
              type === TransactionType.SALE
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } text-xs font-medium px-2 py-1 rounded-full`}
          >
            {getTransactionTypeText(type)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            className={`${getStatusColor(status)} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {getStatusText(status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            title="상세보기"
          >
            <Eye className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            title="수정"
            onClick={() => handleEditTransaction(row.original)}
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            title="영수증 출력"
          >
            <Receipt className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="매입/매출 관리"
      actionText="새 거래 등록"
      stats={stats}
      showExport={true}
      onAction={handleCreateTransaction}
      onFilter={() => {}}
      onExport={() => {}}
    >
      {isLoading ? (
        <TableSkeleton rows={10} cols={8} />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">
            거래 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={displayTransactions}
          searchKey="transactionNumber"
          searchPlaceholder="거래번호 또는 거래처명으로 검색..."
        />
      )}

      {/* 거래 등록/수정 모달 */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={selectedTransaction}
        mode={modalMode}
      />
    </PageLayout>
  );
}