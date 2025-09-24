import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Edit,
  FileText,
  Info,
  Package,
  Receipt,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTransaction, useDeleteTransaction } from "@/hooks/useTransactions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DetailPageHeader } from "@/components/layout/DetailPageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionType } from "@beenest/types";

export function TransactionDetailPage() {
  const navigate = useNavigate();
  const { transactionId } = useParams({ from: "/transactions/$transactionId" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: transactionResponse, isLoading } = useTransaction(transactionId);
  const deleteTransaction = useDeleteTransaction();

  const transaction = transactionResponse?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(transactionId);
      navigate({ to: "/transactions" });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? Number(amount) : amount;
    return `₩${numAmount.toLocaleString("ko-KR")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTransactionTypeInfo = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE:
        return {
          label: "매출",
          icon: ArrowUpRight,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case TransactionType.PURCHASE:
        return {
          label: "매입",
          icon: ArrowDownLeft,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          label: type,
          icon: FileText,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  const typeInfo = getTransactionTypeInfo(transaction.transactionType);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <DetailPageHeader
          title={`거래 ${transaction.transactionNumber}`}
          description={`${typeInfo.label} 거래 상세 정보`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/transactions" })}
                className="cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                목록
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Print receipt")}
                className="cursor-pointer"
              >
                <Receipt className="h-4 w-4 mr-2" />
                영수증
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/transactions/${transactionId}/edit` })}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-600 hover:text-red-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 거래 기본 정보 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  거래 정보
                </h3>
                <Badge className={`${typeInfo.bgColor} ${typeInfo.color}`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeInfo.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">거래번호</label>
                  <p className="flex items-center font-mono">
                    {transaction.transactionNumber}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1 h-auto"
                      onClick={() => navigator.clipboard.writeText(transaction.transactionNumber)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">거래일자</label>
                  <p className="text-lg">{formatDate(transaction.transactionDate)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">거래처</label>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {transaction.supplier?.companyName || transaction.customerName || "정보 없음"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">상태</label>
                  <Badge className="bg-green-100 text-green-800">
                    {transaction.status === "CONFIRMED" ? "확정" : transaction.status}
                  </Badge>
                </div>
              </div>

              {transaction.notes && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500">메모</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </Card>

            {/* 거래 품목 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Package className="h-5 w-5 mr-2 text-purple-500" />
                거래 품목
              </h3>

              <div className="space-y-4">
                {transaction.items?.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="text-sm font-medium text-gray-500">상품명</label>
                        <p className="font-medium">
                          {item.product?.productName || "정보 없음"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">수량</label>
                        <p>{item.quantity}개</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">단가</label>
                        <p>{formatCurrency(item.unitPrice)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">소계</label>
                        <p className="font-bold text-lg">
                          {formatCurrency(Number(item.unitPrice) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">거래 품목 정보가 없습니다</p>
                )}
              </div>
            </Card>

            {/* 금액 요약 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">금액 요약</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>공급가액:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      (transaction.items || []).reduce(
                        (sum, item) => sum + Number(item.unitPrice) * item.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>부가세 (10%):</span>
                  <span className="font-medium">
                    {formatCurrency(
                      Math.round(
                        (transaction.items || []).reduce(
                          (sum, item) => sum + Number(item.unitPrice) * item.quantity,
                          0
                        ) * 0.1
                      )
                    )}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>총액:</span>
                    <span className={typeInfo.color}>
                      {transaction.transactionType === TransactionType.SALE ? "+" : "-"}
                      {formatCurrency(transaction.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>거래 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 거래를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              연관된 재고 변동 기록도 함께 삭제될 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="cursor-pointer"
            >
              취소
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}