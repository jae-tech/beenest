import { SupplierStatus } from "@beenest/types";
import { z } from "zod";

// 거래처 등록/수정 스키마
export const supplierSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요"),
  businessNumber: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // 선택사항이므로 빈 값 허용
        // 사업자번호 형식 검증 (000-00-00000)
        const businessNumberRegex = /^\d{3}-\d{2}-\d{5}$/;
        return businessNumberRegex.test(value);
      },
      {
        message: "올바른 사업자번호 형식을 입력해주세요 (000-00-00000)",
      }
    ),
  contactName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true; // 선택사항이므로 빈 값 허용
        const phoneRegex = /^[\d\-\(\)\+\s]+$/;
        return phoneRegex.test(phone);
      },
      {
        message: "올바른 전화번호 형식을 입력해주세요",
      }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (email) => {
        if (!email) return true; // 선택사항이므로 빈 값 허용
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      {
        message: "올바른 이메일 형식을 입력해주세요",
      }
    ),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(SupplierStatus, {
    errorMap: () => ({ message: "상태를 선택해주세요" }),
  }),
});

// 거래처 검색 스키마
export const supplierSearchSchema = z
  .object({
    search: z.string().optional(),
    status: z.nativeEnum(SupplierStatus).optional(),
    sort: z.enum(["companyName", "createdAt", "updatedAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) => {
      // 정렬 옵션이 있으면 정렬 방향도 있어야 함
      if (data.sort && !data.order) {
        return false;
      }
      return true;
    },
    {
      message: "정렬 방향을 선택해주세요",
      path: ["order"],
    }
  );

// 타입 추출
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type SupplierSearchFormData = z.infer<typeof supplierSearchSchema>;
