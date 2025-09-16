import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Plus, TrendingUp, ArrowUp, ShoppingCart, Users, Calendar, ExternalLink, Search, Download, Package, ChartPie } from "lucide-react";

export const ReportsPage = () => (
  <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
      <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
        <Plus className="w-4 h-4 mr-2" />
        Generate Report
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">$156K</p>
        <p className="text-sm text-gray-600">Monthly Revenue</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <ArrowUp className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">+24.5%</p>
        <p className="text-sm text-gray-600">Growth Rate</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">2,347</p>
        <p className="text-sm text-gray-600">Total Orders</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Users className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">1,856</p>
        <p className="text-sm text-gray-600">Active Customers</p>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Overview
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-2xl font-bold text-gray-900">$16,500</span>
              <span className="text-sm font-medium text-green-600">
                +15% vs last month
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-sm cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
        </div>
        <div className="h-64 bg-gradient-to-t from-yellow-50 to-transparent rounded-lg flex items-end justify-center">
          <img
            src="https://readdy.ai/api/search-image?query=business%20revenue%20growth%20chart%20with%20yellow%20and%20green%20lines%20showing%20upward%20trend%20on%20clean%20white%20background%20minimal%20design%20professional%20analytics%20dashboard&width=600&height=300&seq=revenue-chart-reports&orientation=landscape"
            alt="Revenue Chart"
            className="w-full h-full object-cover object-top rounded-lg"
          />
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Current Period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Previous Period</span>
          </div>
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Selling Products
          </h3>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Wireless Headphones",
              sales: 1234,
              revenue: "$45,678",
              growth: "+12%",
            },
            {
              name: "Laptop Backpack",
              sales: 987,
              revenue: "$23,456",
              growth: "+8%",
            },
            {
              name: "Bluetooth Speaker",
              sales: 756,
              revenue: "$18,234",
              growth: "+15%",
            },
            {
              name: "Phone Case",
              sales: 543,
              revenue: "$12,890",
              growth: "+6%",
            },
            { name: "Desk Lamp", sales: 432, revenue: "$9,876", growth: "+4%" },
          ].map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.sales} units sold
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {product.revenue}
                </p>
                <p className="text-xs text-green-600">{product.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <Tabs defaultValue="sales" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
            <TabsTrigger value="customers">Customer Report</TabsTrigger>
            <TabsTrigger value="financial">Financial Report</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 w-64 text-sm"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              variant="outline"
              className="cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="sales">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Period
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Avg Order Value
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    period: "January 2024",
                    orders: 1247,
                    revenue: 156780,
                    avgOrder: 125.67,
                    growth: "+24.5%",
                  },
                  {
                    period: "December 2023",
                    orders: 1089,
                    revenue: 142340,
                    avgOrder: 130.72,
                    growth: "+18.2%",
                  },
                  {
                    period: "November 2023",
                    orders: 987,
                    revenue: 128950,
                    avgOrder: 130.59,
                    growth: "+12.8%",
                  },
                  {
                    period: "October 2023",
                    orders: 856,
                    revenue: 115670,
                    avgOrder: 135.11,
                    growth: "+8.4%",
                  },
                  {
                    period: "September 2023",
                    orders: 743,
                    revenue: 98450,
                    avgOrder: 132.49,
                    growth: "+5.1%",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {row.period}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {row.orders.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${row.avgOrder}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-green-600">
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Inventory Report
            </h3>
            <p className="text-sm text-gray-500">
              Detailed inventory analytics will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Customer Report
            </h3>
            <p className="text-sm text-gray-500">
              Customer analytics and insights will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="text-center py-12">
            <ChartPie className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Financial Report
            </h3>
            <p className="text-sm text-gray-500">
              Financial analytics and reports will be displayed here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  </div>
);
