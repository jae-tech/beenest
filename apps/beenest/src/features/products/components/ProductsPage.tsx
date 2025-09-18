import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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

  const stats: StatItem[] = [
    {
      title: "전체 상품",
      value: "455",
      description: "전체 상품",
      icon: Package,
      color: "blue",
    },
    {
      title: "재고 있음",
      value: "389",
      description: "재고 있음",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "재고 부족",
      value: "52",
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

  const columns: ColumnDef<ProductItem>[] = [
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
            onClick={() => navigate({ to: `/products/${row.original.sku}` })}
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => navigate({ to: `/products/${row.original.sku}` })}
          >
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
      title="상품 관리"
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
        searchPlaceholder="검색..."
      />
    </PageLayout>
  );
}
