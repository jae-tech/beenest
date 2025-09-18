import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PageLayout } from "@/components/layout";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import {
  Building,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  Star,
  Truck,
} from "lucide-react";
import { useSuppliers } from "../hooks/useSuppliers";
import { type Supplier } from "@/types";
import { type StatItem } from "@/types/design-system";

export function SuppliersPage() {
  const { stats, suppliers, searchTerm, setSearchTerm } = useSuppliers();
  const navigate = useNavigate();

  const statsData: StatItem[] = [
    {
      title: "전체 공급업체",
      value: stats.totalSuppliers,
      description: "전체 공급업체",
      icon: Truck,
      color: "blue",
    },
    {
      title: "활성 공급업체",
      value: stats.activeSuppliers,
      description: "활성 공급업체",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "대기 중인 주문",
      value: stats.pendingOrders,
      description: "대기 중인 주문",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "평균 평점",
      value: stats.avgRating,
      description: "평균 평점",
      icon: Star,
      color: "purple",
    },
  ];

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "공급업체",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {row.getValue("name")}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "연락처",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.getValue("contact")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "지역",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "products",
      header: "제품",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.getValue("products")}
        </div>
      ),
    },
    {
      accessorKey: "orders",
      header: "주문",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          {row.getValue("orders")}
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "평점",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">
            {row.getValue("rating")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            className={`${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            } text-xs font-medium px-2 py-1 rounded-full`}
          >
            {status === "active"
              ? "활성"
              : status === "pending"
                ? "대기"
                : "비활성"}
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
            onClick={() => console.log("공급업체 수정:", row.original.id)}
          >
            <Edit className="w-3 h-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => console.log("공급업체 보기:", row.original.id)}
          >
            <Eye className="w-3 h-3 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 cursor-pointer"
            onClick={() => console.log("공급업체 연락:", row.original.id)}
          >
            <Mail className="w-3 h-3 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="공급업체 관리"
      actionText="신규 추가"
      stats={statsData}
      onAction={() => navigate({ to: '/suppliers/add' })}
      onFilter={() => console.log("필터")}
    >
      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="name"
        searchPlaceholder="검색..."
      />
    </PageLayout>
  );
}
