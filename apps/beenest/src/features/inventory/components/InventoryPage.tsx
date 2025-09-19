import { PageLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  statusColor: string;
};

export function InventoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
  });

  const products = productsResponse?.success ? productsResponse.data || [] : [];
  const pagination = productsResponse?.success
    ? productsResponse.data?.pagination
    : null;

  const stats: StatItem[] = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(
      (p) => p.inventory && p.inventory.currentStock > p.inventory.minimumStock
    ).length;
    const lowStock = products.filter(
      (p) =>
        p.inventory &&
        p.inventory.currentStock <= p.inventory.minimumStock &&
        p.inventory.currentStock > 0
    ).length;
    const outOfStock = products.filter(
      (p) => !p.inventory || p.inventory.currentStock === 0
    ).length;

    return [
      {
        title: "전체 상품",
        value: totalProducts.toString(),
        description: "전체 상품",
        icon: Package,
        color: "blue",
      },
      {
        title: "재고 있음",
        value: inStock.toString(),
        description: "재고 있음",
        icon: CheckCircle,
        color: "green",
      },
      {
        title: "재고 부족",
        value: lowStock.toString(),
        description: "재고 부족",
        icon: AlertTriangle,
        color: "yellow",
      },
      {
        title: "품절",
        value: outOfStock.toString(),
        description: "품절",
        icon: ShoppingCart,
        color: "red",
      },
    ];
  }, [products]);
  const inventoryData: InventoryItem[] = useMemo(() => {
    return products.map((product: Product) => {
      const stock = product.inventory?.currentStock || 0;
      const minStock = product.inventory?.minimumStock || 0;

      let status: string;
      let statusColor: string;

      if (stock === 0) {
        status = "품절";
        statusColor = "bg-red-100 text-red-800";
      } else if (stock <= minStock) {
        status = "재고 부족";
        statusColor = "bg-yellow-100 text-yellow-800";
      } else {
        status = "재고 있음";
        statusColor = "bg-green-100 text-green-800";
      }

      return {
        id: product.id,
        name: product.productName,
        sku: product.productCode,
        category: product.category?.categoryName || "미분류",
        stock: stock,
        price: product.unitPrice,
        status,
        statusColor,
      };
    });
  }, [products]);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "name",
      header: "상품명",
      cell: ({ row, table }) => {
        const index = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);
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
          ₩
          {(
            (row.getValue("stock") as number) *
            (row.getValue("price") as number)
          ).toLocaleString()}
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
      cell: () => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Edit className="h-3 w-3 text-gray-600" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Eye className="h-3 w-3 text-gray-600" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Trash className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="재고 현황"
      actionText="신규 등록"
      stats={stats}
      showExport={true}
      onAction={() => navigate({ to: "/products/add" })}
      onFilter={() => console.log("필터")}
      onExport={() => console.log("내보내기")}
    >
      <DataTable
        columns={columns}
        data={inventoryData}
        searchKey="name"
        searchPlaceholder="상품명 또는 SKU 검색..."
        isLoading={isLoading}
        error={error ? "상품 목록을 불러오는데 실패했습니다." : undefined}
      />
    </PageLayout>
  );
}
