import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Plus, ShoppingCart, Clock, Truck, CheckCircle, Search, Filter, Eye, Edit, Building } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table";

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
      header: "Order ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-900">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
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
      header: "Products",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.getValue("products")} items
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">
          ${(row.getValue("amount") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Order Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("date")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Badge className={`${order.statusColor} text-xs font-medium px-2 py-1 rounded-full`}>
            {row.getValue("status")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
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
    <DataTable columns={columns} data={orders} searchKey="customer" searchPlaceholder="Search orders..." />
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Create New Order
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">89</p>
          <p className="text-sm text-gray-600">Pending Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-600">In Transit</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,002</p>
          <p className="text-sm text-gray-600">Completed</p>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-5">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
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
        </div>
      </Card>
    </div>
  );
}