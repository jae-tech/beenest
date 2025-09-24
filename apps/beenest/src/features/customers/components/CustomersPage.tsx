import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users, UserCheck, ShoppingCart, DollarSign, Search, Filter, Download, User, Edit, Eye, Mail, ChevronLeft, ChevronRight } from "lucide-react";

export const CustomersPage = () => (
  <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
      <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
        <Plus className="w-4 h-4 mr-2" />
        Add New Customer
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Users className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">2,847</p>
        <p className="text-sm text-gray-600">Total Customers</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">2,156</p>
        <p className="text-sm text-gray-600">Active Customers</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">1,234</p>
        <p className="text-sm text-gray-600">Total Orders</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">$234K</p>
        <p className="text-sm text-gray-600">Total Revenue</p>
      </Card>
    </div>

    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-80 text-sm"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            className="cursor-pointer whitespace-nowrap"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button variant="outline" className="cursor-pointer whitespace-nowrap">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Customer
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Phone
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Orders
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "John Smith",
                email: "john@example.com",
                phone: "+1 (555) 123-4567",
                orders: 12,
                totalSpent: 2840.5,
                status: "Active",
                statusColor: "bg-green-100 text-green-800",
              },
              {
                name: "Sarah Johnson",
                email: "sarah@example.com",
                phone: "+1 (555) 987-6543",
                orders: 8,
                totalSpent: 1650.75,
                status: "Active",
                statusColor: "bg-green-100 text-green-800",
              },
              {
                name: "Mike Wilson",
                email: "mike@example.com",
                phone: "+1 (555) 456-7890",
                orders: 3,
                totalSpent: 420.0,
                status: "Inactive",
                statusColor: "bg-gray-100 text-gray-800",
              },
              {
                name: "Emma Davis",
                email: "emma@example.com",
                phone: "+1 (555) 321-0987",
                orders: 15,
                totalSpent: 3200.25,
                status: "VIP",
                statusColor: "bg-purple-100 text-purple-800",
              },
              {
                name: "David Brown",
                email: "david@example.com",
                phone: "+1 (555) 654-3210",
                orders: 7,
                totalSpent: 980.0,
                status: "Active",
                statusColor: "bg-green-100 text-green-800",
              },
            ].map((customer, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {customer.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {customer.email}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.phone}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {customer.orders}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  ${customer.totalSpent.toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <Badge
                    className={`${customer.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                  >
                    {customer.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2 cursor-pointer"
                    >
                      <Mail className="w-3 h-3 text-gray-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">Showing 1-5 of 2,847 customers</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-400 text-black cursor-pointer"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer">
            2
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer">
            3
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  </div>
);
