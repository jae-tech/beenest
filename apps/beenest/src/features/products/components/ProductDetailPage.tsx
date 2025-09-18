import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  Copy,
  History,
  Info,
  Package,
  Save,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Zod 스키마 정의
const productDetailSchema = z.object({
  name: z.string().min(1, "제품명은 필수 입력 항목입니다"),
  sku: z.string().min(1, "SKU는 필수 입력 항목입니다"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().optional(),
  stockLevel: z.number().min(0, "재고 수량은 0 이상이어야 합니다"),
  unitPrice: z.number().min(0.01, "단가는 0보다 커야 합니다"),
  minStockLevel: z.number().min(0, "최소 재고 기준은 0 이상이어야 합니다"),
  status: z.boolean(),
  supplier: z.string().optional(),
  location: z.string().optional(),
});

type ProductFormData = z.infer<typeof productDetailSchema>;

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/_layout/products/$productId" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      description: "",
      stockLevel: 0,
      unitPrice: 0,
      minStockLevel: 0,
      status: true,
      supplier: "",
      location: "",
    },
  });

  // 시뮬레이션 데이터 로딩
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        // TODO: 실제 API 호출로 교체
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockData: ProductFormData = {
          name: "무선 헤드폰",
          sku: "WH-001",
          category: "전자기기",
          stockLevel: 245,
          unitPrice: 89.99,
          minStockLevel: 50,
          status: true,
          description:
            "고품질 무선 헤드폰으로 뛰어난 음질과 편안한 착용감을 제공합니다.",
          supplier: "TechSupply Co.",
          location: "A-1-001",
        };

        form.reset(mockData);
      } catch (error) {
        console.error("상품 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, form]);

  const watchedValues = form.watch();
  const isDirty = form.formState.isDirty;

  const getStockStatus = () => {
    const stockLevel = watchedValues.stockLevel || 0;
    const minStockLevel = watchedValues.minStockLevel || 0;

    if (stockLevel === 0) {
      return { label: "품절", variant: "destructive" as const };
    } else if (stockLevel <= minStockLevel) {
      return { label: "재고 부족", variant: "warning" as const };
    } else {
      return { label: "재고 충분", variant: "success" as const };
    }
  };

  const stockStatus = getStockStatus();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      console.log("상품 정보 저장:", data);
      // TODO: 실제 API 연동
      await new Promise((resolve) => setTimeout(resolve, 2000));

      form.reset(data); // 성공 시 폼 상태 리셋
      // 성공 토스트 표시 (TODO: 토스트 시스템 구현)
    } catch (error) {
      console.error("상품 저장 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      navigate({ to: "/products" });
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("상품 삭제:", productId);
      // TODO: 실제 API 연동
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate({ to: "/products" });
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
    setShowDeleteModal(false);
  };

  const handleDuplicate = () => {
    const currentData = form.getValues();
    // 새 상품 추가 페이지로 이동하면서 현재 데이터 전달
    navigate({
      to: "/products/add",
      // TODO: state로 데이터 전달하는 방법 구현
    });
  };

  const getTotalValue = () => {
    return (watchedValues.stockLevel || 0) * (watchedValues.unitPrice || 0);
  };

  const getStockProgressWidth = () => {
    const stockLevel = watchedValues.stockLevel || 0;
    const minStockLevel = watchedValues.minStockLevel || 0;
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
      quantity: `$${watchedValues.unitPrice}`,
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
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
          { label: "상품 수정" }
        ]}
        title={`상품 수정 - ${watchedValues.name || "로딩 중..."}`}
        subtitle="상품 정보를 수정하고 재고를 관리하세요"
        imageUrl="https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20shot%20on%20clean%20white%20background%20minimal%20ecommerce%20style%20professional%20product%20photography%20modern%20design&width=200&height=200&seq=edit-product-main&orientation=squarish"
        imageAlt={watchedValues.name || "상품 이미지"}
        badges={[
          { label: `SKU: ${watchedValues.sku}`, variant: 'default' },
          { label: stockStatus.label, variant: stockStatus.variant }
        ]}
        rightInfo={{
          label: "마지막 수정",
          value: "2024년 1월 15일 14:30",
          sublabel: "Sarah Kim"
        }}
        actions={[
          {
            label: "변경 이력",
            icon: History,
            onClick: () => {},
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 폼 영역 */}
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
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          제품명 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="제품명을 입력하세요"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          SKU <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SKU를 입력하세요"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          카테고리 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="전자기기">전자기기</SelectItem>
                            <SelectItem value="의류">의류</SelectItem>
                            <SelectItem value="액세서리">액세서리</SelectItem>
                            <SelectItem value="신발">신발</SelectItem>
                            <SelectItem value="가전제품">가전제품</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          공급업체
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="공급업체를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TechSupply Co.">
                              TechSupply Co.
                            </SelectItem>
                            <SelectItem value="Global Electronics">
                              Global Electronics
                            </SelectItem>
                            <SelectItem value="Fashion Forward">
                              Fashion Forward
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        제품 설명
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="제품에 대한 상세 설명을 입력하세요"
                          className="min-h-24 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            제품 상태
                          </FormLabel>
                          <p className="text-xs text-gray-500 mt-1">
                            활성화된 제품만 판매 가능합니다
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <FormField
                    control={form.control}
                    name="stockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          현재 재고 수량 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500">단위: 개</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          단가 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              ₩
                            </span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="h-12 pl-8 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          최소 재고 기준 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500">
                          이 수량 이하일 때 경고 표시
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          창고 위치
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: A-1-001"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      총 재고 가치
                    </label>
                    <div className="h-12 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-lg font-semibold text-gray-900">
                        ${getTotalValue().toLocaleString()}
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
                      {watchedValues.stockLevel}개
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
                      ${getTotalValue().toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          watchedValues.stockLevel <=
                          watchedValues.minStockLevel
                            ? "bg-red-500"
                            : watchedValues.stockLevel <=
                                watchedValues.minStockLevel * 2
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${getStockProgressWidth()}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      최소 기준: {watchedValues.minStockLevel}개
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
                    <div
                      key={index}
                      className="flex items-start space-x-3 text-sm"
                    >
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
                      src="https://readdy.ai/api/search-image?query=premium%20wireless%20headphones%20product%20showcase%20multiple%20angles%20on%20clean%20white%20background%20professional%20ecommerce%20photography%20modern%20design%20high%20quality&width=300&height=200&seq=product-gallery&orientation=landscape"
                      alt="제품 이미지"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
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
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash className="h-4 w-4 mr-2" />
                제품 삭제
              </Button>

              <div className="flex items-center space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "저장 중..." : "변경사항 저장"}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </Form>

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
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 저장하지 않은 변경사항 모달 */}
      <Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <DialogTitle className="text-center">
              저장하지 않은 변경사항
            </DialogTitle>
            <DialogDescription className="text-center">
              저장하지 않은 변경사항이 있습니다. 정말로 페이지를 떠나시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUnsavedModal(false)}
              className="flex-1"
            >
              계속 편집
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate({ to: "/products" })}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              변경사항 버리기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
