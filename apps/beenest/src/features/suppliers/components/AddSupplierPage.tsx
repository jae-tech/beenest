import {
  FormPageFooter,
  FormPageHeader,
  FormPageWrapper,
  FormProgressCard,
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod 스키마 정의 - 백엔드 API와 일치하도록 수정
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
    .max(500, "주소는 500자 이내로 입력해주세요."),
  website: z
    .string()
    .url("올바른 웹사이트 URL을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  taxNumber: z
    .string()
    .max(50, "사업자등록번호는 50자 이내로 입력해주세요.")
    .optional(),
  paymentTerms: z
    .string()
    .max(100, "결제 조건은 100자 이내로 입력해주세요.")
    .optional(),
  deliveryTerms: z
    .string()
    .max(100, "배송 조건은 100자 이내로 입력해주세요.")
    .optional(),
  rating: z.number().min(0).max(5).default(0),
  notes: z
    .string()
    .max(1000, "추가 메모는 1000자 이내로 입력해주세요.")
    .optional(),
});

type SupplierFormData = z.infer<typeof supplierFormSchema>;

export default function AddSupplierPage() {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      taxNumber: "",
      paymentTerms: "",
      deliveryTerms: "",
      rating: 0,
      notes: "",
    },
  });

  const { control, handleSubmit, watch, formState } = form;
  const watchedValues = watch();

  const onSubmit = async (data: SupplierFormData) => {
    try {
      // 백엔드 API 스키마에 맞춰 데이터 변환
      const supplierData = {
        companyName: data.companyName.trim(),
        contactPerson: data.contactPerson.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        website: data.website?.trim() || undefined,
        taxNumber: data.taxNumber?.trim() || undefined,
        paymentTerms: data.paymentTerms?.trim() || undefined,
        deliveryTerms: data.deliveryTerms?.trim() || undefined,
        rating: data.rating || 0,
        notes: data.notes?.trim() || undefined,
        isActive: true,
      };

      console.log("공급업체 저장 요청:", supplierData);

      await createSupplier.mutateAsync(supplierData);

      // 성공 시 공급업체 목록으로 이동
      navigate({ to: "/suppliers" });
    } catch (error: any) {
      console.error("공급업체 저장 실패:", error);

      // 특정 에러에 대한 폼 레벨 에러 설정
      if (error?.error?.message?.includes("이미 존재")) {
        if (error.error.message.includes("이메일")) {
          form.setError("email", {
            type: "manual",
            message: "이미 등록된 이메일 주소입니다.",
          });
        } else if (error.error.message.includes("회사명")) {
          form.setError("companyName", {
            type: "manual",
            message: "이미 등록된 회사명입니다.",
          });
        }
      } else if (error?.error?.message?.includes("유효하지 않은")) {
        form.setError("root", {
          type: "manual",
          message: "입력한 정보가 유효하지 않습니다. 다시 확인해주세요.",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message:
            error?.error?.message || "공급업체 등록 중 오류가 발생했습니다.",
        });
      }
    }
  };

  // 필수 필드 완성도 계산
  const requiredFieldsCompleted = Boolean(
    watchedValues.companyName &&
      watchedValues.contactPerson &&
      watchedValues.email &&
      watchedValues.phone &&
      watchedValues.address
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

          {/* 주소 및 추가 정보 섹션 */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                주소 및 추가 정보
              </h2>
              <p className="text-sm text-gray-600">
                공급업체의 사업장 주소와 추가 정보를 입력해주세요.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                      사업장 주소 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="사업장 주소를 입력하세요"
                        className="min-h-[80px] text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        웹사이트
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
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
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        사업자등록번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123-45-67890"
                          className="h-12 text-sm border-gray-100 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* 거래 조건 및 평가 섹션 */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                거래 조건 및 평가
              </h2>
              <p className="text-sm text-gray-600">
                공급업체와의 거래 조건과 평가 정보를 입력해주세요.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        결제 조건
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 월말 결제, 45일 후 지급 등"
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
                  name="deliveryTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        배송 조건
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 3-5일 배송, 무료배송 등"
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
                        maxLength={1000}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-right text-xs text-gray-500">
                      {field.value?.length || 0}/1000자
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
            onCancel={() => navigate({ to: "/suppliers" })}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={createSupplier.isPending}
            submitText="공급업체 등록"
            cancelText="취소"
            isValid={formState.isValid}
          />
        </form>
      </Form>
    </FormPageWrapper>
  );
}
