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
import { useSuppliers, useSupplierStats } from "../hooks/useSuppliers";
import { type Supplier } from "@/types/api";
import { type StatItem } from "@/types/design-system";
import { useMemo, useState } from "react";

export function SuppliersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: suppliersResponse,
    isLoading,
    error
  } = useSuppliers({
    page,
    limit: 10,
    search: search || undefined
  });

  const {
    data: statsResponse,
    isLoading: isStatsLoading
  } = useSupplierStats();

  const suppliers = suppliersResponse?.success ? suppliersResponse.data?.data || [] : [];
  const pagination = suppliersResponse?.success ? suppliersResponse.data?.pagination : null;
  const statsData = statsResponse?.success ? statsResponse.data : null;

  const stats: StatItem[] = useMemo(() => {
    if (!statsData) {
      return [
        {
          title: "전체 공급업체",
          value: "0",
          description: "전체 공급업체",
          icon: Truck,
          color: "blue",
        },
        {
          title: "활성 공급업체",
          value: "0",
          description: "활성 공급업체",
          icon: CheckCircle,
          color: "green",
        },
        {
          title: "대기 중인 주문",
          value: "0",
          description: "대기 중인 주문",
          icon: Clock,
          color: "yellow",
        },
        {
          title: "평균 평점",
          value: "0.0",
          description: "평균 평점",
          icon: Star,
          color: "purple",
        },
      ];
    }

    return [
      {
        title: "전체 공급업체",
        value: statsData.totalSuppliers?.toString() || "0",
        description: "전체 공급업체",
        icon: Truck,
        color: "blue",
      },
      {
        title: "활성 공급업체",
        value: statsData.activeSuppliers?.toString() || "0",
        description: "활성 공급업체",
        icon: CheckCircle,
        color: "green",
      },
      {
        title: "대기 중인 주문",
        value: statsData.pendingOrders?.toString() || "0",
        description: "대기 중인 주문",
        icon: Clock,
        color: "yellow",
      },
      {
        title: "평균 평점",
        value: statsData.avgRating?.toFixed(1) || "0.0",
        description: "평균 평점",
        icon: Star,
        color: "purple",
      },
    ];
  }, [statsData]);

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "companyName",
      header: "공급업체",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {row.getValue("companyName")}
            </p>
            <p className="text-xs text-gray-500">
              {row.original.supplierCode}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contactPerson",
      header: "담당자",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.getValue("contactPerson") || "-"}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("email") || "-"}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "전화번호",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("phone") || "-"}</div>
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
      stats={stats}
      onAction={() => navigate({ to: '/suppliers/add' })}
      onFilter={() => console.log("필터")}
    >
      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="companyName"
        searchPlaceholder="공사명 또는 코드 검색..."
        isLoading={isLoading}
        error={error ? "공급업체 목록을 불러오는데 실패했습니다." : undefined}
      />
    </PageLayout>
  );
}
