import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  Trash,
} from "lucide-react";

type InventoryItem = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  statusColor: string;
};

export function InventoryPage() {
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

  const columns: ColumnDef<InventoryItem>[] = [
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
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">재고 관리</h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          신규 등록
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="cursor-pointer whitespace-nowrap">
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>
          <Button variant="outline" className="cursor-pointer whitespace-nowrap">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={inventoryData}
          searchKey="name"
          searchPlaceholder="SKU, 상품명, 카테고리로 검색..."
        />
      </Card>
    </div>
  );
}
