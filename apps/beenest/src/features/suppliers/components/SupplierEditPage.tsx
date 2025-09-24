import { useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSupplier, useUpdateSupplier } from "@/hooks/useSuppliers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema, type SupplierFormData } from "@/schemas/supplierSchema";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DetailPageHeader } from "@/components/layout/DetailPageHeader";
import { FormField } from "@/components/forms/FormField";
import { toast } from "sonner";

export function SupplierEditPage() {
  const navigate = useNavigate();
  const { supplierId } = useParams({ from: "/_authenticated/suppliers/$supplierId/edit" });

  const { data: supplierResponse, isLoading } = useSupplier(supplierId);
  const updateSupplier = useUpdateSupplier();

  const supplier = supplierResponse?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (supplier) {
      reset({
        companyName: supplier.companyName,
        businessNumber: supplier.businessNumber || "",
        contactName: supplier.contactName || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        notes: supplier.notes || "",
        status: supplier.status,
      });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await updateSupplier.mutateAsync({
        id: supplierId,
        data,
      });
      toast.success("거래처 정보가 수정되었습니다");
      navigate({ to: `/suppliers/${supplierId}` });
    } catch (error) {
      toast.error("수정 중 오류가 발생했습니다");
      console.error("Failed to update supplier:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!supplier) {
    return <div>Supplier not found</div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <DetailPageHeader
          title="거래처 수정"
          description={`${supplier.companyName} 정보 수정`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/suppliers/${supplierId}` })}
                className="cursor-pointer"
              >
                취소
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="회사명"
                      required
                      error={errors.companyName?.message}
                    >
                      <input
                        {...register("companyName")}
                        className="w-full p-2 border rounded-md"
                        placeholder="회사명을 입력하세요"
                      />
                    </FormField>

                    <FormField
                      label="사업자번호"
                      error={errors.businessNumber?.message}
                    >
                      <input
                        {...register("businessNumber")}
                        className="w-full p-2 border rounded-md"
                        placeholder="000-00-00000"
                      />
                    </FormField>

                    <FormField
                      label="상태"
                      required
                      error={errors.status?.message}
                    >
                      <select
                        {...register("status")}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                      </select>
                    </FormField>
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">연락처 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="담당자명"
                      error={errors.contactName?.message}
                    >
                      <input
                        {...register("contactName")}
                        className="w-full p-2 border rounded-md"
                        placeholder="담당자명을 입력하세요"
                      />
                    </FormField>

                    <FormField
                      label="연락처"
                      error={errors.phone?.message}
                    >
                      <input
                        {...register("phone")}
                        className="w-full p-2 border rounded-md"
                        placeholder="010-0000-0000"
                      />
                    </FormField>

                    <FormField
                      label="이메일"
                      error={errors.email?.message}
                      className="md:col-span-2"
                    >
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="contact@company.com"
                      />
                    </FormField>
                  </div>
                </div>

                {/* 주소 정보 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">주소 정보</h3>
                  <FormField
                    label="주소"
                    error={errors.address?.message}
                  >
                    <input
                      {...register("address")}
                      className="w-full p-2 border rounded-md"
                      placeholder="주소를 입력하세요"
                    />
                  </FormField>
                </div>

                {/* 메모 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">메모</h3>
                  <FormField
                    label="메모"
                    error={errors.notes?.message}
                  >
                    <textarea
                      {...register("notes")}
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      placeholder="거래처 관련 메모를 입력하세요"
                    />
                  </FormField>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}