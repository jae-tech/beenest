import { PageLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/loading";
import {
  useDeleteProduct,
  useLowStockProducts,
  useProducts,
} from "@/hooks/useProducts";
import type { Product } from "@/types/api";
import { type StatItem } from "@/types/design-system";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  Package,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { useState } from "react";

export function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({});

  // 임시: 테스트를 위한 JWT 토큰 설정
  if (!localStorage.getItem("auth_token")) {
    localStorage.setItem(
      "auth_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTgyNDczMjcsImV4cCI6MTc1ODI0ODIyN30.1ohRu9WzKKLFB882jEooXEcGiUXCuyHFwKIE8rL-8FA"
    );
  }

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts(searchParams);
  const { data: lowStockResponse, isLoading: isLowStockLoading } =
    useLowStockProducts();
  const deleteProduct = useDeleteProduct();

  const products = productsResponse?.data || [];
  const totalProducts = productsResponse?.data?.pagination?.total || 0;
  const lowStockProducts = lowStockResponse?.data || [];

  // 디버깅을 위한 콘솔 로그
  console.log("=== ProductsPage 디버깅 ===");
  console.log("API Response:", productsResponse);
  console.log("Products Array:", products);
  console.log("Total Products:", totalProducts);
  console.log("Low Stock Products:", lowStockProducts);
  console.log("Loading:", isProductsLoading);
  console.log("Error:", productsError);
  console.log("Search Params:", searchParams);

  // 실제 API 데이터 구조에 맞게 통계 계산
  const stockProducts = products.filter((p) => {
    const currentStock = p.inventory?.currentStock || 0;
    const minimumStock = p.inventory?.minimumStock || 0;
    return currentStock > minimumStock;
  });

  const outOfStockProducts = products.filter((p) => {
    const currentStock = p.inventory?.currentStock || 0;
    return currentStock === 0;
  });

  // 재고 부족 상품 (재고는 있지만 최소 재고보다 적은 경우)
  const lowStockProductsFromCurrent = products.filter((p) => {
    const currentStock = p.inventory?.currentStock || 0;
    const minimumStock = p.inventory?.minimumStock || 0;
    return currentStock > 0 && currentStock <= minimumStock;
  });

  const stats: StatItem[] = [
    {
      title: "전체 상품",
      value: totalProducts.toString(),
      description: "전체 상품",
      icon: Package,
      color: "blue",
    },
    {
      title: "재고 있음",
      value: stockProducts.length.toString(),
      description: "재고 있음",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "재고 부족",
      value: lowStockProductsFromCurrent.length.toString(),
      description: "재고 부족",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      title: "품절",
      value: outOfStockProducts.length.toString(),
      description: "품절",
      icon: ShoppingCart,
      color: "red",
    },
  ];

  const handleDelete = async (productId: string) => {
    if (confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await deleteProduct.mutateAsync(productId);
      } catch (error) {
        // 에러는 hook에서 처리됨
      }
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "productName",
      header: "상품명",
      cell: ({ row, table }) => {
        const index = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);
        return (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={`https://readdy.ai/api/search-image?query=${encodeURIComponent(row.getValue("productName"))}&width=100&height=100&seq=inventory-${index}&orientation=squarish`}
                alt={row.getValue("productName")}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {row.getValue("productName")}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "productCode",
      header: "SKU",
      cell: ({ row }) => (
        <div className="text-sm font-mono text-gray-900">
          {row.getValue("productCode")}
        </div>
      ),
    },
    {
      accessorKey: "category.categoryName",
      header: "카테고리",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-gray-600">
            {product.category?.categoryName || "미분류"}
          </div>
        );
      },
    },
    {
      accessorKey: "inventory.currentStock",
      header: "재고",
      cell: ({ row }) => {
        const product = row.original;
        const currentStock = product.inventory?.currentStock || 0;
        return (
          <div className="text-sm font-medium text-gray-900">
            {currentStock}개
          </div>
        );
      },
    },
    {
      accessorKey: "unitPrice",
      header: "단가",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{Number(row.getValue("unitPrice")).toLocaleString()}
        </div>
      ),
    },
    {
      id: "total",
      header: "총액",
      cell: ({ row }) => {
        const product = row.original;
        const currentStock = product.inventory?.currentStock || 0;
        const unitPrice = Number(product.unitPrice);
        const total = currentStock * unitPrice;
        return (
          <div className="text-sm font-medium text-gray-900">
            ₩{total.toLocaleString()}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "상태",
      cell: ({ row }) => {
        const product = row.original;
        const currentStock = product.inventory?.currentStock || 0;
        const minimumStock = product.inventory?.minimumStock || 0;

        let status: string;
        let statusColor: string;

        if (currentStock === 0) {
          status = "품절";
          statusColor = "bg-red-100 text-red-800";
        } else if (currentStock <= minimumStock) {
          status = "재고 부족";
          statusColor = "bg-yellow-100 text-yellow-800";
        } else {
          status = "재고 있음";
          statusColor = "bg-green-100 text-green-800";
        }

        return (
          <Badge
            className={`${statusColor} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => navigate({ to: `/products/${row.original.id}/edit` })}
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => navigate({ to: `/products/${row.original.id}` })}
          >
            <Eye className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => handleDelete(row.original.id.toString())}
            disabled={deleteProduct.isPending}
          >
            <Trash className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="상품 관리"
      actionText="신규 등록"
      stats={stats}
      showExport={true}
      onAction={() => navigate({ to: "/products/add" })}
      onFilter={() => console.log("필터")}
      onExport={() => console.log("내보내기")}
    >
      {isProductsLoading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : productsError ? (
        <div className="text-center py-8">
          <p className="text-red-600">
            상품 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKey="productName"
          searchPlaceholder="상품명 또는 SKU로 검색..."
        />
      )}
    </PageLayout>
  );
}
