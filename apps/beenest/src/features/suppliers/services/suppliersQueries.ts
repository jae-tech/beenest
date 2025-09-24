import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

// 쿼리 키 상수들
export const suppliersQueryKeys = {
  all: ["suppliers"] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...suppliersQueryKeys.all, "list", filters] as const,
};

// 거래처 목록 조회
export const useSuppliers = (filters?: {
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: suppliersQueryKeys.list(filters),
    queryFn: () => api.getSuppliers(filters),
    staleTime: 5 * 60 * 1000, // 5분
  });
};
