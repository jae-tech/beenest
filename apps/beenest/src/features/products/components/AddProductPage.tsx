import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CloudUpload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

// Zod 스키마 정의
const productSchema = z.object({
  productName: z.string().min(1, "상품명을 입력해주세요"),
  sku: z.string().min(1, "SKU를 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().optional(),
  unitPrice: z.string().min(1, "단가를 입력해주세요"),
  initialStock: z.string().min(1, "초기 재고 수량을 입력해주세요"),
  supplier: z.string().min(1, "공급업체를 선택해주세요"),
  minStockThreshold: z.string().min(1, "최소 재고 기준치를 입력해주세요"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      sku: "",
      category: "",
      description: "",
      unitPrice: "",
      initialStock: "",
      supplier: "",
      minStockThreshold: "",
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
    setIsSubmitting(true);
    try {
      console.log("상품 저장:", data);
      console.log("업로드된 이미지:", uploadedImages);

      // TODO: API 연동 및 실제 저장 로직 구현
      await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션

      navigate({ to: "/products" });
    } catch (error) {
      console.error("상품 저장 실패:", error);
    } finally {
      setIsSubmitting(false);
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
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          SKU *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SKU를 입력하세요 (예: WH-001)"
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
                          카테고리 *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electronics">전자제품</SelectItem>
                            <SelectItem value="apparel">의류</SelectItem>
                            <SelectItem value="accessories">액세서리</SelectItem>
                            <SelectItem value="footwear">신발</SelectItem>
                            <SelectItem value="home">홈&리빙</SelectItem>
                            <SelectItem value="sports">스포츠</SelectItem>
                            <SelectItem value="books">도서</SelectItem>
                            <SelectItem value="beauty">뷰티</SelectItem>
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
                          공급업체 *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                              <SelectValue placeholder="공급업체를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="techsupply">TechSupply Co.</SelectItem>
                            <SelectItem value="globalelec">Global Electronics</SelectItem>
                            <SelectItem value="fashionfw">Fashion Forward</SelectItem>
                            <SelectItem value="sportsgear">Sports Gear Ltd</SelectItem>
                            <SelectItem value="homeessentials">Home Essentials Inc</SelectItem>
                            <SelectItem value="beautyworld">Beauty World Co.</SelectItem>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          단가 *
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minStockThreshold"
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
            isSubmitting={isSubmitting}
            isValid={form.formState.isValid}
            submitText="상품 저장하기"
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}