import { queryKeys } from "@/lib/query-client";
import { handleApiError, handleApiSuccess } from "@/lib/toast";
import { productsService } from "@/services/products.service";
import type {
  CreateProductRequest,
  ProductsSearchParams,
  UpdateProductRequest,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 상품 목록 조회
export function useProducts(params?: ProductsSearchParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.getProducts(params),
    enabled: true,
  });
}

// 상품 상세 조회
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
  });
}

// 재고 부족 상품 목록
export function useLowStockProducts() {
  return useQuery({
    queryKey: [...queryKeys.products.all, "low-stock"],
    queryFn: () => productsService.getLowStockProducts(),
  });
}

// 상품 검색 (자동완성)
export function useProductSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.products.all, "search", query],
    queryFn: () => productsService.searchProducts(query),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30초
  });
}

// 상품 생성 뮤테이션
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      productsService.createProduct(data),
    onSuccess: () => {
      handleApiSuccess("상품이 성공적으로 등록되었습니다.");
      // 상품 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

// 상품 수정 뮤테이션
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
    onSuccess: (product, variables) => {
      handleApiSuccess("상품이 성공적으로 수정되었습니다.");
      // 해당 상품 상세 쿼리 업데이트
      queryClient.setQueryData(
        queryKeys.products.detail(variables.id),
        product
      );
      // 상품 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

// 상품 삭제 뮤테이션
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, id) => {
      handleApiSuccess("상품이 성공적으로 삭제되었습니다.");
      // 해당 상품 관련 쿼리 제거
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
      // 상품 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

// 재고 수동 조정 뮤테이션
export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { quantity: number; reason?: string };
    }) => productsService.adjustStock(id, data),
    onSuccess: (product, variables) => {
      handleApiSuccess("재고가 성공적으로 조정되었습니다.");
      // 해당 상품 상세 쿼리 업데이트
      queryClient.setQueryData(
        queryKeys.products.detail(variables.id),
        product
      );
      // 상품 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

// 상품 재고 이력 조회
export function useStockHistory(productId: string) {
  return useQuery({
    queryKey: queryKeys.stockMovements.list(productId),
    queryFn: () => productsService.getStockHistory(productId),
    enabled: !!productId,
  });
}

// 여러 상품 작업을 위한 유틸리티 훅
export function useProductActions() {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const adjustStock = useAdjustStock();

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    isLoading:
      createProduct.isPending ||
      updateProduct.isPending ||
      deleteProduct.isPending ||
      adjustStock.isPending,
  };
}
