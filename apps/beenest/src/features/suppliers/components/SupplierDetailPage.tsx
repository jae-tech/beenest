import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Building,
  Copy,
  Edit,
  History,
  Info,
  Mail,
  MapPin,
  Phone,
  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSupplier, useDeleteSupplier } from "@/hooks/useSuppliers";

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

export function SupplierDetailPage() {
  const navigate = useNavigate();
  const { supplierId } = useParams({ from: "/suppliers/$supplierId" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: supplierResponse, isLoading } = useSupplier(supplierId);
  const deleteSupplier = useDeleteSupplier();

  const supplier = supplierResponse?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!supplier) {
    return <div>Supplier not found</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteSupplier.mutateAsync(supplierId);
      navigate({ to: "/suppliers" });
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800">비활성</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <DetailPageHeader
          title={supplier.companyName}
          description="거래처 상세 정보"
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/suppliers" })}
                className="cursor-pointer"
              >
                <Building className="h-4 w-4 mr-2" />
                목록
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/suppliers/${supplierId}/edit` })}
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
            {/* 기본 정보 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  기본 정보
                </h3>
                {getStatusBadge(supplier.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">회사명</label>
                  <p className="text-lg font-semibold">{supplier.companyName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">사업자번호</label>
                  <p className="flex items-center">
                    {supplier.businessNumber || "미등록"}
                    {supplier.businessNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-1 h-auto"
                        onClick={() => navigator.clipboard.writeText(supplier.businessNumber || "")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">담당자명</label>
                  <p className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.contactName || "미등록"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">연락처</label>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.phone || "미등록"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">이메일</label>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.email || "미등록"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">주소</label>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.address || "미등록"}
                  </p>
                </div>
              </div>

              {supplier.notes && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500">메모</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {supplier.notes}
                  </p>
                </div>
              )}
            </Card>

            {/* 거래 통계 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <History className="h-5 w-5 mr-2 text-purple-500" />
                거래 통계
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">총 거래 건수</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₩0</p>
                  <p className="text-sm text-gray-600">총 거래 금액</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">-</p>
                  <p className="text-sm text-gray-600">최근 거래일</p>
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
            <DialogTitle>거래처 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 거래처를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              연관된 거래 내역이 있는 경우 삭제가 제한될 수 있습니다.
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
              disabled={deleteSupplier.isPending}
            >
              {deleteSupplier.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}