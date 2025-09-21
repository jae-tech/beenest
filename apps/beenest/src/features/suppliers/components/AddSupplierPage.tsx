import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormPageHeader,
  FormPageFooter,
  FormPageWrapper,
  FormProgressCard,
} from "@/components/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod 스키마 정의
const supplierFormSchema = z.object({
  companyName: z
    .string()
    .min(1, "회사명을 입력해주세요.")
    .max(100, "회사명은 100자 이내로 입력해주세요."),
  contactPerson: z
    .string()
    .min(1, "담당자명을 입력해주세요.")
    .max(50, "담당자명은 50자 이내로 입력해주세요."),
  email: z
    .string()
    .min(1, "이메일 주소를 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^[\d\-+()\s]+$/, "올바른 전화번호 형식을 입력해주세요."),
  address: z
    .string()
    .min(1, "주소를 입력해주세요.")
    .max(200, "주소는 200자 이내로 입력해주세요."),
  city: z.string().max(50, "시/군/구는 50자 이내로 입력해주세요.").optional(),
  state: z.string().max(50, "시/도는 50자 이내로 입력해주세요.").optional(),
  postalCode: z
    .string()
    .max(20, "우편번호는 20자 이내로 입력해주세요.")
    .optional(),
  country: z.string().max(50, "국가는 50자 이내로 입력해주세요.").optional(),
  products: z.array(z.string()).default([]),
  paymentTerms: z.string().min(1, "결제 조건을 선택해주세요."),
  rating: z.number().min(0).max(5).default(0),
  notes: z
    .string()
    .max(500, "추가 메모는 500자 이내로 입력해주세요.")
    .optional(),
});

type SupplierFormData = z.infer<typeof supplierFormSchema>;

export default function AddSupplierPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      products: [],
      paymentTerms: "",
      rating: 0,
      notes: "",
    },
  });

  const { control, handleSubmit, watch, formState } = form;
  const watchedValues = watch();

  const productOptions = [
    "전자제품",
    "의류 및 패션",
    "가정용품",
    "스포츠 용품",
    "사무용품",
    "건강 및 미용",
    "자동차 부품",
    "산업 장비",
  ];

  const paymentTermsOptions = [
    "즉시 결제",
    "15일 내 결제",
    "30일 내 결제",
    "45일 내 결제",
    "60일 내 결제",
    "90일 내 결제",
  ];

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting supplier data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 성공 후 공급업체 목록 페이지로 이동
      navigate({ to: "/suppliers" });
    } catch (error) {
      console.error("Failed to add supplier:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 필수 필드 완성도 계산
  const requiredFieldsCompleted = Boolean(
    watchedValues.companyName &&
      watchedValues.contactPerson &&
      watchedValues.email &&
      watchedValues.phone &&
      watchedValues.address &&
      watchedValues.paymentTerms
  );

  return (
    <FormPageWrapper>
      <FormPageHeader
        backPath="/suppliers"
        backText="공급업체 관리로 돌아가기"
        title="신규 공급업체 등록"
        subtitle="새로운 공급업체 정보를 입력하여 시스템에 등록하세요."
      />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 섹션 */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                기본 정보
              </h2>
              <p className="text-sm text-gray-600">
                공급업체의 기본적인 연락처 정보를 입력해주세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      회사명 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="회사명을 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      담당자명 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="담당자명을 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      이메일 주소 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="이메일 주소를 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      전화번호 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="전화번호를 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* 주소 정보 섹션 */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                주소 정보
              </h2>
              <p className="text-sm text-gray-600">
                공급업체의 사업장 주소를 입력해주세요.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      도로명 주소 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="도로명 주소를 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        시/군/구
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="시/군/구"
                          className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        시/도
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="시/도"
                          className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        우편번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="우편번호"
                          className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      국가
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="국가를 입력하세요"
                        className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* 사업 세부정보 섹션 */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                사업 세부정보
              </h2>
              <p className="text-sm text-gray-600">
                공급업체의 사업 관련 정보를 입력해주세요.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={control}
                name="products"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      공급 제품/서비스
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {productOptions.map((product) => (
                        <FormField
                          key={product}
                          control={control}
                          name="products"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={product}
                                className="flex items-center space-x-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(product)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            product,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== product
                                            )
                                          );
                                    }}
                                    className="border-gray-300 text-yellow-400 focus:ring-yellow-400"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-gray-700 cursor-pointer">
                                  {product}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      결제 조건 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400">
                          <SelectValue placeholder="결제 조건을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      초기 평가 (5점 척도)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className={`text-2xl cursor-pointer transition-colors ${
                              star <= field.value
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } hover:text-yellow-400`}
                          >
                            <Star
                              className="h-5 w-5"
                              fill={
                                star <= field.value ? "currentColor" : "none"
                              }
                            />
                          </button>
                        ))}
                        {field.value > 0 && (
                          <span className="text-sm text-gray-600 ml-2">
                            {field.value}점
                          </span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      추가 메모
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="공급업체에 대한 추가 정보나 특이사항을 입력하세요..."
                        className="min-h-[100px] text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-right text-xs text-gray-500">
                      {field.value?.length || 0}/500자
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <FormProgressCard
            isComplete={requiredFieldsCompleted && formState.isValid}
            message="양식 작성 진행 상태"
          />

          <FormPageFooter
            onCancel={() => navigate({ to: "/suppliers" })}
            onSubmit={() => {}} // handleSubmit은 form onSubmit에서 처리
            isSubmitting={isSubmitting}
            submitText="공급업체 등록"
            cancelText="취소"
            isValid={formState.isValid}
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}
