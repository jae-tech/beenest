import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { useSuppliers } from "../hooks/useSuppliers";
import { Plus, Truck, CheckCircle, Clock, Star, Search, Filter, Building, Edit, Eye, Mail } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

type Supplier = {
  id: string;
  name: string;
  contact: string;
  location: string;
  products: string;
  orders: string;
  rating: number;
  status: "active" | "pending" | "inactive";
};

export function SuppliersPage() {
  const { stats, suppliers, searchTerm, setSearchTerm } = useSuppliers();

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
        <div className="text-sm text-gray-900">
          {row.getValue("contact")}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "지역",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("location")}
        </div>
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
            {status === "active" ? "활성" : status === "pending" ? "대기" : "비활성"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "작업",
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
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">공급업체 관리</h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          신규 공급업체 추가
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalSuppliers}
          </p>
          <p className="text-sm text-gray-600">전체 공급업체</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.activeSuppliers}
          </p>
          <p className="text-sm text-gray-600">활성 공급업체</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingOrders}
          </p>
          <p className="text-sm text-gray-600">대기 중인 주문</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
          <p className="text-sm text-gray-600">평균 평점</p>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card className="p-6">
        <DataTable columns={columns} data={suppliers} searchKey="name" searchPlaceholder="공급업체 검색..." />
      </Card>
    </div>
  );
}
