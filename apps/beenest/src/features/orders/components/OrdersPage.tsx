import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { PageLayout } from "@/components/layout";
import { ShoppingCart, Clock, Truck, CheckCircle, Eye, Edit, Building } from 'lucide-react';
import { type ColumnDef } from "@tanstack/react-table";
import { type StatItem } from "@/types/design-system";

type Order = {
  id: string;
  customer: string;
  products: number;
  amount: number;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Pending";
  statusColor: string;
};

export function OrdersPage() {
  const stats: StatItem[] = [
    {
      title: "전체 주문",
      value: "1,247",
      description: "전체 주문",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "대기 주문",
      value: "89",
      description: "대기 주문",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "배송 중",
      value: "156",
      description: "배송 중",
      icon: Truck,
      color: "green",
    },
    {
      title: "완료",
      value: "1,002",
      description: "완료",
      icon: CheckCircle,
      color: "purple",
    },
  ];
  // All orders data
  const allOrders: Order[] = [
    {
      id: "#ORD-2024-001",
      customer: "Acme Corp",
      products: 5,
      amount: 1250.0,
      date: "2024-01-15",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#ORD-2024-002",
      customer: "Tech Solutions",
      products: 3,
      amount: 890.5,
      date: "2024-01-14",
      status: "In Transit",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "#ORD-2024-003",
      customer: "Global Industries",
      products: 8,
      amount: 2100.75,
      date: "2024-01-13",
      status: "Processing",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "#ORD-2024-004",
      customer: "StartUp Inc",
      products: 2,
      amount: 450.0,
      date: "2024-01-12",
      status: "Pending",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      id: "#ORD-2024-005",
      customer: "Enterprise Ltd",
      products: 12,
      amount: 3200.25,
      date: "2024-01-11",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  // Filter orders by status
  const pendingOrders = allOrders.filter(order => order.status === "Pending");
  const processingOrders = allOrders.filter(order => order.status === "Processing");
  const shippedOrders = allOrders.filter(order => order.status === "In Transit");
  const deliveredOrders = allOrders.filter(order => order.status === "Delivered");

  // Define columns for the data table
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "주문 ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-900">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "고객",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Building className="h-3 w-3 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {row.getValue("customer")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "products",
      header: "상품",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.getValue("products")}개
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "총 금액",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{(row.getValue("amount") as number * 1300).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "주문일자",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("date")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const order = row.original;
        const statusMap = {
          "Delivered": "배송완료",
          "In Transit": "배송중",
          "Processing": "처리중",
          "Pending": "대기중"
        };
        return (
          <Badge className={`${order.statusColor} text-xs font-medium px-2 py-1 rounded-full`}>
            {statusMap[row.getValue("status") as keyof typeof statusMap]}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Eye className="h-3 w-3 text-gray-600" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Edit className="h-3 w-3 text-gray-600" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 cursor-pointer">
            <Truck className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  const renderOrderTable = (orders: Order[]) => (
    <DataTable columns={columns} data={orders} searchKey="customer" searchPlaceholder="검색..." />
  );

  return (
    <PageLayout
      title="주문 관리"
      actionText="신규 주문"
      stats={stats}
      onAction={() => console.log("신규 주문")}
      onFilter={() => console.log("필터")}
    >
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-fit grid-cols-5">
            <TabsTrigger value="all">전체 주문</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="processing">처리중</TabsTrigger>
            <TabsTrigger value="shipped">배송중</TabsTrigger>
            <TabsTrigger value="delivered">완료</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-6">
          {renderOrderTable(allOrders)}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          {renderOrderTable(pendingOrders)}
        </TabsContent>
        <TabsContent value="processing" className="mt-6">
          {renderOrderTable(processingOrders)}
        </TabsContent>
        <TabsContent value="shipped" className="mt-6">
          {renderOrderTable(shippedOrders)}
        </TabsContent>
        <TabsContent value="delivered" className="mt-6">
          {renderOrderTable(deliveredOrders)}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}