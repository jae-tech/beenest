import { useCategories } from "@/hooks/useCategories";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useSuppliers } from "@/hooks/useSuppliers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CloudUpload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  FormPageFooter,
  FormPageHeader,
  FormPageWrapper,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
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

// Zod 스키마 정의 - AddProductPage와 동일
const productSchema = z.object({
  productName: z
    .string()
    .min(1, "상품명을 입력해주세요")
    .max(100, "상품명은 100자 이내로 입력해주세요"),
  productCode: z
    .string()
    .min(1, "상품 코드를 입력해주세요")
    .max(50, "상품 코드는 50자 이내로 입력해주세요")
    .regex(/^[A-Z0-9-_]+$/i, "상품 코드는 영문, 숫자, -, _ 만 사용 가능합니다"),
  categoryId: z.string().optional(),
  description: z
    .string()
    .max(1000, "상품 설명은 1000자 이내로 입력해주세요")
    .optional(),
  unitPrice: z
    .number()
    .min(0.01, "판매 단가를 입력해주세요")
    .max(999999999, "판매 단가가 너무 큽니다"),
  costPrice: z
    .number()
    .min(0, "원가는 0 이상이어야 합니다")
    .max(999999999, "원가가 너무 큽니다")
    .optional(),
  barcode: z
    .string()
    .regex(/^[0-9]*$/, "바코드는 숫자만 입력 가능합니다")
    .optional(),
  weight: z
    .number()
    .min(0, "무게는 0 이상이어야 합니다")
    .max(999999, "무게가 너무 큽니다")
    .optional(),
  dimensions: z
    .string()
    .max(100, "규격/치수는 100자 이내로 입력해주세요")
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams({
    from: "/products/$productId/edit",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // API 훅들
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    data: suppliersResponse,
    isLoading: isSuppliersLoading,
    error: suppliersError,
  } = useSuppliers();
  const {
    data: productResponse,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productId);
  const updateProduct = useUpdateProduct();

  const categories = categoriesResponse || [];
  const suppliers = suppliersResponse?.data || [];
  const product = productResponse;

  // 데이터 로딩 상태
  const isInitialLoading =
    isCategoriesLoading || isSuppliersLoading || isProductLoading;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      productName: "",
      productCode: "",
      categoryId: "",
      description: "",
      unitPrice: 0,
      costPrice: 0,
      barcode: "",
      weight: 0,
      dimensions: "",
    },
  });

  // 상품 데이터가 로드되면 폼에 초기값 설정
  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.productName || "",
        productCode: product.productCode || "",
        categoryId: product.categoryId?.toString() || "",
        description: product.description || "",
        unitPrice: Number(product.unitPrice) || 0,
        costPrice: Number(product.costPrice) || 0,
        barcode: product.barcode || "",
        weight: Number(product.weight) || 0,
        dimensions: product.dimensions || "",
      });

      // 기존 이미지 설정
      if (product.imageUrl) {
        setUploadedImages([product.imageUrl]);
      }
    }
  }, [product, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!productId) return;

    try {
      // 백엔드 API 스키마에 맞춰 데이터 준비
      const productData = {
        productName: data.productName.trim(),
        productCode: data.productCode.trim().toUpperCase(),
        description: data.description?.trim() || undefined,
        categoryId:
          data.categoryId && data.categoryId !== "none"
            ? parseInt(data.categoryId, 10)
            : undefined,
        unitPrice: data.unitPrice,
        costPrice: data.costPrice || undefined,
        barcode: data.barcode?.trim() || undefined,
        weight: data.weight || undefined,
        dimensions: data.dimensions?.trim() || undefined,
        imageUrl: uploadedImages[0] || undefined,
        isActive: true,
      };

      console.log("상품 수정 요청:", productData);

      await updateProduct.mutateAsync({ id: productId, data: productData });

      // 성공 시 상품 목록으로 이동
      navigate({ to: "/products" });
    } catch (error: any) {
      console.error("상품 수정 실패:", error);

      // 특정 에러에 대한 폼 레벨 에러 설정
      if (error?.error?.message?.includes("이미 존재하는 상품 코드")) {
        form.setError("productCode", {
          type: "manual",
          message: "이미 사용 중인 상품 코드입니다. 다른 코드를 입력해주세요.",
        });
      } else if (error?.error?.message?.includes("카테고리")) {
        form.setError("categoryId", {
          type: "manual",
          message: "선택한 카테고리가 유효하지 않습니다.",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: error?.error?.message || "상품 수정 중 오류가 발생했습니다.",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate({ to: "/products" });
  };

  // 로딩 중 화면
  if (isInitialLoading) {
    return (
      <FormPageWrapper>
        <FormPageHeader
          backPath="/products"
          backText="상품 관리로 돌아가기"
          title="상품 수정"
          subtitle="상품 정보를 수정하세요."
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
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </Card>
      </FormPageWrapper>
    );
  }

  // 에러 화면 - 상품을 찾을 수 없는 경우
  if (productError) {
    return (
      <FormPageWrapper>
        <FormPageHeader
          backPath="/products"
          backText="상품 관리로 돌아가기"
          title="상품 수정"
          subtitle="상품 정보를 수정하세요."
        />
        <Card className="p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              상품을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              요청하신 상품이 존재하지 않거나 삭제되었습니다.
            </p>
            <Button
              onClick={() => navigate({ to: "/products" })}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              상품 목록으로 돌아가기
            </Button>
          </div>
        </Card>
      </FormPageWrapper>
    );
  }

  // 기타 데이터 로딩 에러
  if (categoriesError || suppliersError) {
    return (
      <FormPageWrapper>
        <FormPageHeader
          backPath="/products"
          backText="상품 관리로 돌아가기"
          title="상품 수정"
          subtitle="상품 정보를 수정하세요."
        />
        <Card className="p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              데이터 로딩 실패
            </h3>
            <p className="text-gray-600 mb-4">
              카테고리 또는 거래처 정보를 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </Card>
      </FormPageWrapper>
    );
  }

  // 폼이 변경되었는지 확인
  const isFormDirty = form.formState.isDirty;

  return (
    <FormPageWrapper>
      <FormPageHeader
        backPath="/products"
        backText="상품 관리로 돌아가기"
        title="상품 수정"
        subtitle="상품 정보를 수정하세요."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-6">
            <div className="space-y-8">
              {/* 기본 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  기본 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          상품명 *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="상품명을 입력하세요"
                            className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          상품 코드 *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="상품 코드를 입력하세요 (예: PRD001)"
                            className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 font-mono"
                            {...field}
                            onChange={(e) => {
                              // 자동 대문자 변환 및 특수문자 제거
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9\-_]/g, "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          카테고리
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              카테고리 선택 안함
                            </SelectItem>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.parentCategory &&
                                  `${category.parentCategory.categoryName} > `}
                                {category.categoryName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          원가
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        상품 설명
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="상품에 대한 자세한 설명을 입력하세요..."
                          className="min-h-24 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 가격 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  가격 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          판매 단가 *
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

                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          원가
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
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        재고 관리 안내
                      </h4>
                      <p className="text-sm text-blue-700">
                        재고 수량 변경은 별도의 재고 관리 페이지에서 처리하실 수
                        있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상품 세부 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  상품 세부 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          바코드
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="바코드를 입력하세요"
                            className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          무게 (g)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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

                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          규격/치수
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 20cm x 18cm x 8cm"
                            className="h-12 border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 상품 이미지 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  상품 이미지
                </h2>

                <div className="space-y-4">
                  {/* 이미지 업로드 영역 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <CloudUpload className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            이미지를 업로드하세요
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG, GIF 파일을 드래그하거나 클릭하여
                            선택하세요
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            최대 10개 파일, 각 파일당 최대 5MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* 업로드된 이미지 미리보기 */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`업로드된 이미지 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-medium">
                              대표 이미지
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
            isSubmitting={updateProduct.isPending}
            isValid={form.formState.isValid && isFormDirty}
            submitText="상품 수정하기"
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}
