import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  Copy,
  Edit,
  History,
  Info,
  Package,
  Settings,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useInventoryByProduct } from "@/hooks/useInventory";

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

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/_layout/products/$productId" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API hooks
  const { data: productResponse, isLoading: isProductLoading, isError: isProductError } = useProduct(productId);
  const { data: inventoryResponse, isLoading: isInventoryLoading } = useInventoryByProduct(productId);
  const deleteProduct = useDeleteProduct();

  // API 응답 구조에 따른 데이터 접근
  const product = productResponse;
  const inventory = inventoryResponse?.inventory || inventoryResponse;

  // 로딩 상태 및 에러 처리
  const isLoading = isProductLoading || isInventoryLoading;

  if (isProductError) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">상품을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-4">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Button onClick={() => navigate({ to: "/products" })}>
            상품 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const getStockStatus = () => {
    const stockLevel = product?.inventory?.currentStock || inventory?.currentStock || 0;
    const minStockLevel = product?.inventory?.minimumStock || inventory?.minimumStock || 0;

    if (stockLevel === 0) {
      return { label: "품절", variant: "destructive" as const };
    } else if (stockLevel <= minStockLevel) {
      return { label: "재고 부족", variant: "warning" as const };
    } else {
      return { label: "재고 충분", variant: "success" as const };
    }
  };

  const stockStatus = getStockStatus();

  const handleEdit = () => {
    navigate({ to: `/products/${productId}/edit` });
  };

  const handleAdjustStock = () => {
    navigate({ to: `/inventory/adjust/${productId}` });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      navigate({ to: "/products" });
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
    setShowDeleteModal(false);
  };

  const handleDuplicate = () => {
    navigate({
      to: "/products/add",
      search: { clone: productId }
    });
  };

  const getTotalValue = () => {
    const stockLevel = product?.inventory?.currentStock || inventory?.currentStock || 0;
    const unitPrice = product?.unitPrice || 0;
    return stockLevel * unitPrice;
  };

  const getStockProgressWidth = () => {
    const stockLevel = product?.inventory?.currentStock || inventory?.currentStock || 0;
    const minStockLevel = product?.inventory?.minimumStock || inventory?.minimumStock || 0;
    return Math.min(100, (stockLevel / (minStockLevel * 3)) * 100);
  };

  const mockRecentActivity = [
    {
      action: "재고 추가",
      quantity: "+50개",
      date: "2시간 전",
      user: "Sarah Kim",
    },
    {
      action: "가격 수정",
      quantity: `₩${(product?.unitPrice || 0).toLocaleString()}`,
      date: "1일 전",
      user: "John Doe",
    },
    {
      action: "재고 출고",
      quantity: "-25개",
      date: "2일 전",
      user: "Mike Chen",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <DetailPageHeader
        backPath="/products"
        breadcrumbs={[
          { label: "상품 관리", path: "/products" },
          { label: "상품 상세" }
        ]}
        title={product?.productName || "상품 상세"}
        subtitle="상품 정보를 확인하고 관리하세요"
        imageUrl={product?.imageUrl || "https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20shot%20on%20clean%20white%20background%20minimal%20ecommerce%20style%20professional%20product%20photography%20modern%20design&width=200&height=200&seq=product-detail&orientation=squarish"}
        imageAlt={product?.productName || "상품 이미지"}
        badges={[
          { label: `SKU: ${product?.productCode || 'N/A'}`, variant: 'default' },
          { label: stockStatus.label, variant: stockStatus.variant },
          { label: product?.isActive ? '활성' : '비활성', variant: product?.isActive ? 'success' : 'secondary' }
        ]}
        rightInfo={{
          label: "마지막 수정",
          value: product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString('ko-KR') : 'N/A',
          sublabel: product?.category?.categoryName || 'N/A'
        }}
        actions={[
          {
            label: "편집",
            icon: Edit,
            onClick: handleEdit,
            variant: 'default'
          },
          {
            label: "재고 조정",
            icon: Settings,
            onClick: handleAdjustStock,
            variant: 'outline'
          },
          {
            label: "변경 이력",
            icon: History,
            onClick: () => navigate({ to: `/products/${productId}/history` }),
            variant: 'outline'
          },
          {
            label: "복제",
            icon: Copy,
            onClick: handleDuplicate,
            variant: 'outline'
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                기본 정보
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  제품명
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900 font-medium">{product?.productName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  SKU
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900 font-mono">{product?.productCode || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  카테고리
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900">{product?.category?.categoryName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  공급업체
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900">{product?.preferredSupplier?.companyName || 'N/A'}</p>
                </div>
              </div>
            </div>

            {product?.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  제품 설명
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    제품 상태
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    현재 제품의 활성화 상태입니다
                  </p>
                </div>
                <Badge variant={product?.isActive ? 'success' : 'secondary'}>
                  {product?.isActive ? '활성' : '비활성'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* 재고 정보 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                재고 정보
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  현재 재고 수량
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    {(product?.inventory?.currentStock || inventory?.currentStock || 0).toLocaleString()}개
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">단위: 개</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  단가
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    ₩{(product?.unitPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  최소 재고 기준
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    {(product?.inventory?.minimumStock || inventory?.minimumStock || 0).toLocaleString()}개
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  이 수량 이하일 때 경고 표시
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  창고 위치
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900">{product?.inventory?.warehouseLocation || inventory?.warehouseLocation || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  총 재고 가치
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    ₩{getTotalValue().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 재고 현황 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              재고 현황
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">현재 재고</span>
                <span className="text-lg font-semibold text-gray-900">
                  {(product?.inventory?.currentStock || inventory?.currentStock || 0).toLocaleString()}개
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">재고 상태</span>
                <Badge variant={stockStatus.variant} className="text-xs">
                  {stockStatus.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">총 가치</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₩{getTotalValue().toLocaleString()}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (product?.inventory?.currentStock || inventory?.currentStock || 0) <=
                      (product?.inventory?.minimumStock || inventory?.minimumStock || 0)
                        ? "bg-red-500"
                        : (product?.inventory?.currentStock || inventory?.currentStock || 0) <=
                            (product?.inventory?.minimumStock || inventory?.minimumStock || 0) * 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${getStockProgressWidth()}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  최소 기준: {(product?.inventory?.minimumStock || inventory?.minimumStock || 0).toLocaleString()}개
                </p>
              </div>
            </div>
          </Card>

          {/* 최근 활동 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              최근 활동
            </h3>
            <div className="space-y-3">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium">
                      {activity.action}
                    </p>
                    <p className="text-gray-600">{activity.quantity}</p>
                    <p className="text-gray-500 text-xs">
                      {activity.date} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 제품 이미지 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              제품 이미지
            </h3>
            <div className="space-y-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product?.imageUrl || "https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20showcase%20multiple%20angles%20on%20clean%20white%20background%20professional%20ecommerce%20photography%20modern%20design%20high%20quality&width=300&height=200&seq=product-gallery&orientation=landscape"}
                  alt={product?.productName || "제품 이미지"}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button variant="outline" className="w-full" onClick={handleEdit}>
                <Camera className="h-4 w-4 mr-2" />
                이미지 변경
              </Button>
            </div>
          </Card>

        </div>
      </div>

      {/* 액션 버튼 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash className="h-4 w-4 mr-2" />
            제품 삭제
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleAdjustStock}
            >
              <Settings className="h-4 w-4 mr-2" />
              재고 조정
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              <Edit className="h-4 w-4 mr-2" />
              정보 수정
            </Button>
          </div>
        </div>
      </Card>

      {/* 삭제 확인 모달 */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-center">제품 삭제 확인</DialogTitle>
            <DialogDescription className="text-center">
              정말로 이 제품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {deleteProduct.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}