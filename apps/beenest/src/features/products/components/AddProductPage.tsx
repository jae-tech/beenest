import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CloudUpload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useCreateProduct } from "@/hooks/useProducts";

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
import {
  FormPageWrapper,
  FormPageHeader,
  FormPageFooter,
} from "@/components/forms";

// Zod 스키마 정의 - API 구조에 맞게 수정
const productSchema = z.object({
  productName: z.string().min(1, "상품명을 입력해주세요"),
  productCode: z.string().min(1, "상품 코드를 입력해주세요"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  unitPrice: z.number().min(0.01, "단가를 입력해주세요"),
  costPrice: z.number().optional(),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  initialStock: z.number().min(0, "초기 재고 수량을 입력해주세요"),
  minimumStock: z.number().min(0, "최소 재고 기준치를 입력해주세요"),
  reorderPoint: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // API 훅들
  const { data: categoriesResponse } = useCategories();
  const { data: suppliersResponse } = useSuppliers();
  const createProduct = useCreateProduct();

  const categories = categoriesResponse?.data || [];
  const suppliers = suppliersResponse?.data?.data || [];

  // 임시: 테스트를 위한 JWT 토큰 설정
  if (!localStorage.getItem("auth_token")) {
    localStorage.setItem(
      "auth_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJ1c2VyQGJlZW5lc3QuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTgyNDg3NjMsImV4cCI6MTc1ODI0OTY2M30.8Caj-OojYfAXtkC-pFTmwu0RbyEysjtTxzD5UGcVYQ4"
    );
  }

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
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
      initialStock: 0,
      minimumStock: 0,
      reorderPoint: 0,
    },
  });

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
    try {
      // API 요청 데이터 준비
      const productData = {
        productName: data.productName,
        productCode: data.productCode,
        description: data.description || undefined,
        categoryId: data.categoryId && data.categoryId !== "none" ? BigInt(data.categoryId) : undefined,
        unitPrice: data.unitPrice,
        costPrice: data.costPrice || undefined,
        barcode: data.barcode || undefined,
        weight: data.weight || undefined,
        dimensions: data.dimensions || undefined,
        imageUrl: uploadedImages[0] || undefined, // 첫 번째 이미지를 대표 이미지로
        isActive: true,
        initialStock: data.initialStock,
        minimumStock: data.minimumStock,
        reorderPoint: data.reorderPoint || undefined,
      };

      console.log("상품 저장:", productData);

      await createProduct.mutateAsync(productData);
      navigate({ to: "/products" });
    } catch (error) {
      console.error("상품 저장 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/products" });
  };

  return (
    <FormPageWrapper>
      <FormPageHeader
        backPath="/products"
        backText="상품 관리로 돌아가기"
        title="새 상품 추가"
        subtitle="상품 정보를 입력하여 시스템에 등록하세요."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-6">
            <div className="space-y-8">
              {/* 기본 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
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
                    name="productCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          상품 코드 *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="상품 코드를 입력하세요 (예: PRD001)"
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          카테고리
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">카테고리 선택 안함</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.parentCategory && `${category.parentCategory.categoryName} > `}
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
                              className="h-12 pl-8 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                          className="min-h-24 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 가격 및 재고 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  가격 및 재고 정보
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                              className="h-12 pl-8 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initialStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          초기 재고 수량 *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          최소 재고 기준치 *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reorderPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          재주문 기준점
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 상품 세부 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
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
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                            className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
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
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
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
                            JPG, PNG, GIF 파일을 드래그하거나 클릭하여 선택하세요
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

                  {/* 샘플 이미지들 */}
                  {uploadedImages.length === 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={`https://readdy.ai/api/search-image?query=modern%20product%20placeholder%20image%20with%20clean%20white%20background%20minimal%20design%20professional%20ecommerce%20style%20photography&width=200&height=200&seq=placeholder-${index}&orientation=squarish`}
                            alt={`상품 이미지 샘플 ${index}`}
                            className="w-full h-full object-cover opacity-50"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <FormPageFooter
            onCancel={handleCancel}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={createProduct.isPending}
            isValid={form.formState.isValid}
            submitText="상품 저장하기"
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}