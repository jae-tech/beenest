import { z } from "zod";
import { TransactionType } from "@beenest/types";

// 거래 품목 스키마
export const transactionItemSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "상품을 선택해주세요"),
  productName: z.string().min(1, "상품명이 필요합니다"),
  quantity: z.number().min(1, "수량은 1개 이상이어야 합니다"),
  unitPrice: z.number().min(0, "단가는 0 이상이어야 합니다"),
  totalPrice: z.number().min(0, "총액은 0 이상이어야 합니다"),
});

// 거래 등록/수정 스키마
export const transactionSchema = z.object({
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "거래 구분을 선택해주세요" }),
  }),
  transactionDate: z.string().min(1, "거래일자를 선택해주세요").refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 7); // 일주일 후까지 허용

      return selectedDate <= maxDate;
    },
    {
      message: "거래일자는 일주일 이후까지만 설정할 수 있습니다",
    }
  ),
  supplierId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional().refine(
    (phone) => {
      if (!phone) return true; // 선택사항이므로 빈 값 허용
      const phoneRegex = /^[\d\-\(\)\+\s]+$/;
      return phoneRegex.test(phone);
    },
    {
      message: "올바른 전화번호 형식을 입력해주세요",
    }
  ),
  notes: z.string().optional(),
  items: z.array(transactionItemSchema).min(1, "최소 1개의 품목이 필요합니다"),
  subtotalAmount: z.number().min(0, "공급가액은 0 이상이어야 합니다"),
  vatAmount: z.number().min(0, "부가세는 0 이상이어야 합니다"),
  totalAmount: z.number().min(0, "총액은 0 이상이어야 합니다"),
}).refine(
  (data) => {
    // 매입의 경우 공급업체 필수, 매출의 경우 고객명 필수
    if (data.transactionType === TransactionType.PURCHASE) {
      return data.supplierId && data.supplierId.trim().length > 0;
    } else {
      return data.customerName && data.customerName.trim().length > 0;
    }
  },
  {
    message: "거래처 정보를 입력해주세요",
    path: ["customerName"], // 에러 표시 위치
  }
);

// 거래 검색 스키마
export const transactionSearchSchema = z.object({
  search: z.string().optional(),
  transactionType: z.nativeEnum(TransactionType).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: "종료일은 시작일보다 늦어야 합니다",
    path: ["endDate"],
  }
);

// 타입 추출
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type TransactionItemFormData = z.infer<typeof transactionItemSchema>;
export type TransactionSearchFormData = z.infer<typeof transactionSearchSchema>;