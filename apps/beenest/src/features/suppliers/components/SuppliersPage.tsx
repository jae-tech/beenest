import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSuppliers, useCreateSupplier, useUpdateSupplier } from "@/hooks/useSuppliers";
import { type Supplier } from "@beenest/types";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Building,
  Edit,
  Eye,
  Mail,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 간소화된 거래처 등록 스키마
const supplierFormSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요."),
  contactPerson: z.string().optional(),
  email: z.string().email("올바른 이메일을 입력해주세요.").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(1, "주소를 입력해주세요."),
  taxNumber: z.string().min(1, "사업자등록번호를 입력해주세요."),
  notes: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierFormSchema>;

export function SuppliersPage() {
  const navigate = useNavigate();
  const [search] = useState("");
  const [page] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const { data: suppliersResponse } = useSuppliers({
    page,
    limit: 10,
    search: search || undefined,
  });

  const suppliers = suppliersResponse?.data || [];


  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      taxNumber: "",
      notes: "",
    },
  });

  const handleAddSupplier = async (data: SupplierFormData) => {
    try {
      const supplierData = {
        companyName: data.companyName.trim(),
        contactPerson: data.contactPerson?.trim() || undefined,
        email: data.email?.trim().toLowerCase() || undefined,
        phone: data.phone?.trim() || undefined,
        address: data.address.trim(),
        taxNumber: data.taxNumber.trim(),
        notes: data.notes?.trim() || undefined,
        isActive: true,
        rating: 0,
      };

      await createSupplier.mutateAsync(supplierData);
      setIsAddModalOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("거래처 등록 실패:", error);
      form.setError("root", {
        type: "manual",
        message: error?.error?.message || "거래처 등록 중 오류가 발생했습니다.",
      });
    }
  };

  const handleStatusToggle = async (supplier: Supplier, newStatus: boolean) => {
    try {
      await updateSupplier.mutateAsync({
        id: supplier.id,
        data: {
          ...supplier,
          isActive: newStatus,
          supplierStatus: newStatus ? 'active' : 'inactive',
        },
      });
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "companyName",
      header: "거래처명",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {row.getValue("companyName")}
            </p>
            <p className="text-xs text-gray-500">{row.original.supplierCode}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contactPerson",
      header: "담당자",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.getValue("contactPerson") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("email") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "전화번호",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("phone") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "상태",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        const supplier = row.original;

        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => handleStatusToggle(supplier, checked)}
              disabled={updateSupplier.isPending}
            />
            <span className={`status-pill ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? "활성" : "비활성"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => (
        <div className="btn-group">
          <button
            className="btn-icon"
            onClick={() =>
              navigate({ to: `/suppliers/${row.original.id}/edit` })
            }
            title="수정"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="btn-icon"
            onClick={() => navigate({ to: `/suppliers/${row.original.id}` })}
            title="보기"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn-icon"
            onClick={() =>
              window.open(`mailto:${row.original.email}`, "_blank")
            }
            title="이메일 보내기"
            disabled={!row.original.email}
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageLayout
        title="거래처 관리"
        actionText="신규 등록"
        onAction={() => setIsAddModalOpen(true)}
        onFilter={() => {}}
      >
        <DataTable
          columns={columns}
          data={suppliers}
          searchKey="companyName"
          searchPlaceholder="거래처명 또는 코드 검색..."
        />
      </PageLayout>

      {/* 신규 거래처 등록 모달 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>신규 거래처 등록</DialogTitle>
            <DialogDescription>
              새로운 거래처 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSupplier)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>거래처명 *</FormLabel>
                      <FormControl>
                        <Input placeholder="거래처명을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>담당자명</FormLabel>
                      <FormControl>
                        <Input placeholder="담당자명을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="이메일을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <Input placeholder="전화번호를 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사업자등록번호 *</FormLabel>
                      <FormControl>
                        <Input placeholder="123-45-67890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주소 *</FormLabel>
                    <FormControl>
                      <Input placeholder="주소를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>메모</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="추가 메모사항을 입력하세요..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="btn-beenest-secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    form.reset();
                  }}
                  disabled={createSupplier.isPending}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-beenest-primary"
                  disabled={createSupplier.isPending}
                >
                  <Plus className="w-4 h-4" />
                  {createSupplier.isPending ? "등록 중..." : "등록"}
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
