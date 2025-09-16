import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, Edit, Eye, Trash, ChevronLeft, ChevronRight } from 'lucide-react';

export function InventoryPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search by SKU, name, or category..."
                className="pl-10 pr-4 py-2 w-80 text-sm"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              variant="outline"
              className="cursor-pointer whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer whitespace-nowrap"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  SKU
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Stock Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Unit Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Total Value
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
                  name: "Wireless Headphones",
                  sku: "WH-001",
                  category: "Electronics",
                  stock: 245,
                  price: 89.99,
                  status: "In Stock",
                  statusColor: "bg-green-100 text-green-800",
                },
                {
                  name: "Cotton T-Shirt",
                  sku: "CT-002",
                  category: "Apparel",
                  stock: 15,
                  price: 24.99,
                  status: "Low Stock",
                  statusColor: "bg-yellow-100 text-yellow-800",
                },
                {
                  name: "Laptop Backpack",
                  sku: "LB-003",
                  category: "Accessories",
                  stock: 0,
                  price: 49.99,
                  status: "Out of Stock",
                  statusColor: "bg-red-100 text-red-800",
                },
                {
                  name: "Bluetooth Speaker",
                  sku: "BS-004",
                  category: "Electronics",
                  stock: 128,
                  price: 79.99,
                  status: "In Stock",
                  statusColor: "bg-green-100 text-green-800",
                },
                {
                  name: "Running Shoes",
                  sku: "RS-005",
                  category: "Footwear",
                  stock: 67,
                  price: 129.99,
                  status: "In Stock",
                  statusColor: "bg-green-100 text-green-800",
                },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`https://readdy.ai/api/search-image?query=$%7Bitem.name.toLowerCase%28%29.replace%28%20%2C%20-%29%7D%20product%20on%20clean%20white%20background%20minimal%20ecommerce%20style%20professional%20product%20photography&width=100&height=100&seq=inventory-${index}&orientation=squarish`}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-mono text-gray-900">
                    {item.sku}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.category}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {item.stock} units
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    ${item.price}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    ${(item.stock * item.price).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`${item.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-gray-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <Trash className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Showing 1-5 of 1,247 items</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}