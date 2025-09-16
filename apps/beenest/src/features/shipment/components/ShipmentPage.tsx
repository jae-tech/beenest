import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Plus, Truck, Clock, CheckCircle, AlertTriangle, Search, Filter, User, Eye, MapPin, Printer } from "lucide-react";

export const ShipmentPage = () => (
  <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
      <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
        <Plus className="w-4 h-4 mr-2" />
        Create Shipment
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">1,456</p>
        <p className="text-sm text-gray-600">Total Shipments</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">189</p>
        <p className="text-sm text-gray-600">In Transit</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">1,234</p>
        <p className="text-sm text-gray-600">Delivered</p>
      </Card>
      <Card className="p-4 text-center">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">33</p>
        <p className="text-sm text-gray-600">Delayed</p>
      </Card>
    </div>

    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-5">
              <TabsTrigger value="all">All Shipments</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="delayed">Delayed</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search shipments..."
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
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Tracking ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Destination
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Ship Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Est. Delivery
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
                      trackingId: "#TRK-2024-001",
                      customer: "John Smith",
                      destination: "New York, NY",
                      shipDate: "2024-01-15",
                      estDelivery: "2024-01-18",
                      status: "Delivered",
                      statusColor: "bg-green-100 text-green-800",
                    },
                    {
                      trackingId: "#TRK-2024-002",
                      customer: "Sarah Johnson",
                      destination: "Los Angeles, CA",
                      shipDate: "2024-01-16",
                      estDelivery: "2024-01-19",
                      status: "In Transit",
                      statusColor: "bg-blue-100 text-blue-800",
                    },
                    {
                      trackingId: "#TRK-2024-003",
                      customer: "Mike Wilson",
                      destination: "Chicago, IL",
                      shipDate: "2024-01-17",
                      estDelivery: "2024-01-20",
                      status: "Processing",
                      statusColor: "bg-yellow-100 text-yellow-800",
                    },
                    {
                      trackingId: "#TRK-2024-004",
                      customer: "Emma Davis",
                      destination: "Houston, TX",
                      shipDate: "2024-01-18",
                      estDelivery: "2024-01-21",
                      status: "Delayed",
                      statusColor: "bg-red-100 text-red-800",
                    },
                    {
                      trackingId: "#TRK-2024-005",
                      customer: "David Brown",
                      destination: "Phoenix, AZ",
                      shipDate: "2024-01-19",
                      estDelivery: "2024-01-22",
                      status: "In Transit",
                      statusColor: "bg-blue-100 text-blue-800",
                    },
                  ].map((shipment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-gray-900">
                        {shipment.trackingId}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {shipment.customer}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {shipment.destination}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {shipment.shipDate}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {shipment.estDelivery}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={`${shipment.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                        >
                          {shipment.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
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
                            <MapPin className="w-3 h-3 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2 cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-gray-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  </div>
);
