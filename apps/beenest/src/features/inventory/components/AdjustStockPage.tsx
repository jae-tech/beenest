import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Package, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormPageFooter,
  FormPageHeader,
  FormPageWrapper,
} from "@/components/forms";
import { Card } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";

import { useAdjustStock, useInventoryByProduct } from "@/hooks/useInventory";
import { useProducts } from "@/hooks/useProducts";
import type { AdjustStockRequest } from "@/types/api";
import { MovementType } from "@beenest/types";

// Zod 스키마 정의
const adjustStockSchema = z.object({
  productId: z.string().min(1, "상품을 선택해주세요"),
  movementType: z.enum(["IN", "OUT", "ADJUST"] as const, {
    message: "조정 유형을 선택해주세요",
  }),
  quantity: z
    .number()
    .min(1, "수량은 1 이상이어야 합니다")
    .max(999999, "수량이 너무 큽니다"),
  unitCost: z.number().min(0, "단가는 0 이상이어야 합니다").optional(),
  reason: z
    .string()
    .min(1, "조정 사유를 입력해주세요")
    .max(100, "조정 사유는 100자 이내로 입력해주세요"),
  notes: z.string().max(500, "메모는 500자 이내로 입력해주세요").optional(),
});

type AdjustStockFormData = z.infer<typeof adjustStockSchema>;

const movementTypeOptions = [
  { value: "IN", label: "입고", icon: TrendingUp, color: "text-green-600" },
  { value: "OUT", label: "출고", icon: TrendingDown, color: "text-red-600" },
  {
    value: "ADJUST",
    label: "재고 조정",
    icon: RotateCcw,
    color: "text-blue-600",
  },
] as const;

interface SearchParams {
  productId?: string;
}

export default function AdjustStockPage() {
  const navigate = useNavigate();
  const params = useParams({ from: "/inventory/$productId/adjust" });
  const search = useSearch({
    from: "/inventory/adjust",
  }) as SearchParams;

  // URL에서 productId 가져오기 (파라미터 또는 쿼리스트링)
  const selectedProductId = params?.productId || search?.productId;

  // API 훅들
  const { data: productsResponse, isLoading: isProductsLoading } =
    useProducts();
  const { data: inventoryResponse, isLoading: isInventoryLoading } =
    useInventoryByProduct(selectedProductId || "");
  const adjustStock = useAdjustStock();

  const products = productsResponse?.data || [];
  const inventory = inventoryResponse?.inventory;
  const product = inventoryResponse?.product;

  const form = useForm<AdjustStockFormData>({
    resolver: zodResolver(adjustStockSchema),
    mode: "onChange",
    defaultValues: {
      productId: selectedProductId || "",
      movementType: "ADJUST",
      quantity: 1,
      unitCost: 0,
      reason: "",
      notes: "",
    },
  });

  const watchedProductId = form.watch("productId");
  const watchedMovementType = form.watch("movementType");
  const watchedQuantity = form.watch("quantity");

  // 선택된 상품의 재고 정보 표시
  const currentStock = inventory?.currentStock || 0;
  const minimumStock = inventory?.minimumStock || 0;
  const reservedStock = inventory?.reservedStock || 0;
  const availableStock = inventory?.availableStock || 0;

  // 조정 후 예상 재고 계산
  const calculateNewStock = () => {
    if (!watchedQuantity || !watchedMovementType) return currentStock;

    switch (watchedMovementType) {
      case MovementType.IN:
        return currentStock + watchedQuantity;
      case MovementType.OUT:
        return Math.max(0, currentStock - watchedQuantity);
      case MovementType.ADJUST:
        return Math.max(0, currentStock + watchedQuantity);
      default:
        return currentStock;
    }
  };

  const newStock = calculateNewStock();

  const onSubmit = async (data: AdjustStockFormData) => {
    try {
      const adjustData: AdjustStockRequest = {
        quantity: data.quantity,
        movementType: data.movementType,
        unitCost: data.unitCost,
        referenceType: "ADJUSTMENT",
        reason: data.reason,
        notes: data.notes,
      };

      await adjustStock.mutateAsync({
        productId: data.productId,
        data: adjustData,
      });

      // 성공 시 재고 관리 페이지로 이동
      navigate({ to: "/inventory" });
    } catch (error: any) {
      console.error("재고 조정 실패:", error);

      form.setError("root", {
        type: "manual",
        message: error?.error?.message || "재고 조정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    navigate({ to: "/inventory" });
  };

  // 로딩 중 화면
  if (isProductsLoading || (selectedProductId && isInventoryLoading)) {
    return (
      <FormPageWrapper>
        <FormPageHeader
          backPath="/inventory"
          backText="재고 관리로 돌아가기"
          title="재고 조정"
          subtitle="상품의 재고를 조정하세요."
        />
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </FormPageWrapper>
    );
  }

  return (
    <FormPageWrapper>
      <FormPageHeader
        backPath="/inventory"
        backText="재고 관리로 돌아가기"
        title="재고 조정"
        subtitle="상품의 재고를 조정하세요."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 상품 선택 */}
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                상품 선택
              </h2>

              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      조정할 상품 *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400">
                          <SelectValue placeholder="상품을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            <div className="flex items-center space-x-3">
                              <Package className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium">
                                  {product.productName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.productCode}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 현재 재고 정보 */}
              {watchedProductId && inventory && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    현재 재고 현황
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">현재 재고</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentStock}개
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">가용 재고</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {availableStock}개
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">예약 재고</p>
                      <p className="text-lg font-semibold text-orange-600">
                        {reservedStock}개
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">최소 재고</p>
                      <p className="text-lg font-semibold text-red-600">
                        {minimumStock}개
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 조정 정보 */}
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                조정 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="movementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        조정 유형 *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400">
                            <SelectValue placeholder="조정 유형을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {movementTypeOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className={`h-4 w-4 ${option.color}`} />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        조정 수량 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="조정할 수량을 입력하세요"
                          className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedMovementType === MovementType.IN && (
                  <FormField
                    control={form.control}
                    name="unitCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          단위 원가
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              ₩
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-12 pl-8 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        조정 사유 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="조정 사유를 입력하세요"
                          className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      메모
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="추가 메모나 설명을 입력하세요..."
                        className="min-h-24 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 조정 후 예상 재고 */}
              {watchedProductId && watchedQuantity > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    조정 후 예상 재고
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-blue-700">
                        현재: {currentStock}개
                      </p>
                    </div>
                    <div className="text-blue-500">→</div>
                    <div>
                      <p className="text-sm text-blue-700">
                        조정 후:{" "}
                        <span className="font-semibold text-blue-900">
                          {newStock}개
                        </span>
                      </p>
                    </div>
                  </div>
                  {newStock < minimumStock && (
                    <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                      ⚠️ 조정 후 재고가 최소 재고({minimumStock}개)보다
                      적습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 전역 에러 메시지 */}
          {form.formState.errors.root && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-red-900 mb-1">오류</h4>
                  <p className="text-sm text-red-700">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormPageFooter
            onCancel={handleCancel}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={adjustStock.isPending}
            isValid={form.formState.isValid}
            submitText="재고 조정하기"
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}
