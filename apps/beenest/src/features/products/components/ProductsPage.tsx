import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/loading";
import { PageLayout } from "@/components/layout";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { type StatItem } from "@/types/design-system";
import { useNavigate } from "@tanstack/react-router";
import { useProducts, useLowStockProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useState } from "react";
import type { Product } from "@/types/api";

type ProductItem = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  statusColor: string;
};

export function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({});

  const { data: productsResponse, isLoading: isProductsLoading, error: productsError } = useProducts(searchParams);
  const { data: lowStockResponse, isLoading: isLowStockLoading } = useLowStockProducts();
  const deleteProduct = useDeleteProduct();

  const products = productsResponse?.data?.products || [];
  const totalProducts = productsResponse?.data?.total || 0;
  const lowStockProducts = lowStockResponse?.data || [];

  const stockProducts = products.filter(p => p.stockLevel > p.minStockLevel);

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
      value: lowStockProducts.length.toString(),
      description: "재고 부족",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      title: "품절",
      value: "14",
      description: "품절",
      icon: ShoppingCart,
      color: "red",
    },
  ];
  const inventoryData: InventoryItem[] = [
    {
      name: "무선 헤드폰",
      sku: "WH-001",
      category: "전자제품",
      stock: 245,
      price: 89.99,
      status: "재고 있음",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      name: "면 티셔츠",
      sku: "CT-002",
      category: "의류",
      stock: 15,
      price: 24.99,
      status: "재고 부족",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "노트북 백팩",
      sku: "LB-003",
      category: "액세서리",
      stock: 0,
      price: 49.99,
      status: "품절",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      name: "블루투스 스피커",
      sku: "BS-004",
      category: "전자제품",
      stock: 128,
      price: 79.99,
      status: "재고 있음",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      name: "러닝화",
      sku: "RS-005",
      category: "신발",
      stock: 67,
      price: 129.99,
      status: "재고 있음",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  const handleDelete = async (productId: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await deleteProduct.mutateAsync(productId);
      } catch (error) {
        // 에러는 hook에서 처리됨
      }
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "상품명",
      cell: ({ row, table }) => {
        const index = table.getRowModel().rows.findIndex(r => r.id === row.id);
        return (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={`https://readdy.ai/api/search-image?query=${encodeURIComponent(row.getValue("name"))}&width=100&height=100&seq=inventory-${index}&orientation=squarish`}
                alt={row.getValue("name")}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {row.getValue("name")}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div className="text-sm font-mono text-gray-900">
          {row.getValue("sku")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "카테고리",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "stock",
      header: "재고",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.getValue("stock")}개
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "단가",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{(row.getValue("price") as number).toLocaleString()}
        </div>
      ),
    },
    {
      id: "total",
      header: "총액",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{((row.getValue("stock") as number) * (row.getValue("price") as number)).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Badge
            className={`${item.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {row.getValue("status")}
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
            onClick={() => navigate({ to: `/products/${row.original.id}` })}
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
          <p className="text-red-600">상품 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="상품명 또는 SKU로 검색..."
        />
      )}
    </PageLayout>
  );
}
