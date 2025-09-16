import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import React, { useState } from "react";
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState("login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4">
              <i className="fas fa-cube text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beenest</h1>
            <p className="text-gray-600">Welcome back to your inventory hub</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <span>Remember me</span>
              </label>
              <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer">
                Forgot password?
              </button>
            </div>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold !rounded-button whitespace-nowrap cursor-pointer"
            >
              Sign In to Beenest
            </Button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?
              <button className="text-yellow-600 hover:text-yellow-700 font-medium ml-1 cursor-pointer">
                Contact Sales
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  const Sidebar = () => (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} min-h-screen flex flex-col`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <i className="fas fa-cube text-black text-sm"></i>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold">Beenest</span>
          )}
        </div>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4 mb-4">
          {!sidebarCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              MENU
            </span>
          )}
        </div>
        <nav className="space-y-1 px-2">
          {[
            {
              icon: "fas fa-chart-line",
              label: "Dashboard",
              view: "dashboard",
              active: currentView === "dashboard",
            },
            {
              icon: "fas fa-boxes",
              label: "Inventory",
              view: "inventory",
              active: currentView === "inventory",
            },
            {
              icon: "fas fa-shipping-fast",
              label: "Orders",
              view: "orders",
              active: currentView === "orders",
            },
            {
              icon: "fas fa-store",
              label: "Suppliers",
              view: "suppliers",
              active: currentView === "suppliers",
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                const mainContent = document.querySelector(".main-content");
                if (mainContent) {
                  mainContent.classList.add("opacity-0");
                  setTimeout(() => {
                    setCurrentView(item.view);
                    mainContent.classList.remove("opacity-0");
                  }, 300);
                } else {
                  setCurrentView(item.view);
                }
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                item.active
                  ? "bg-yellow-400 text-black"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <i className={`${item.icon} text-sm`}></i>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 mt-8 mb-4">
          {!sidebarCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              GENERAL
            </span>
          )}
        </div>
        <nav className="space-y-1 px-2">
          {[
            { icon: "fas fa-question-circle", label: "Help" },
            { icon: "fas fa-cog", label: "Settings" },
            { icon: "fas fa-shield-alt", label: "Privacy" },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className={`${item.icon} text-sm`}></i>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={() => setCurrentView("login")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2"
          >
            <i className="fas fa-sign-out-alt text-sm"></i>
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <i className="fas fa-bars text-gray-600"></i>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">☀️</span>
            <h1 className="text-xl font-semibold text-gray-900">
              Hello Sarah 👋
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Search inventory, orders, customers..."
              className="w-80 pl-10 pr-4 py-2 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <Button
            variant="outline"
            className="p-2 border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            <i className="fas fa-sliders-h text-gray-600"></i>
          </Button>
          <Button
            variant="outline"
            className="p-2 border-gray-200 hover:bg-gray-50 relative cursor-pointer"
          >
            <i className="fas fa-bell text-gray-600"></i>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
            <i className="fas fa-plus mr-2"></i>
            Add New Product
          </Button>
        </div>
      </div>
    </div>
  );
  const MetricCard = ({ icon, title, value, change, color, trend }: any) => (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <i className={`${icon} text-xl text-white`}></i>
        </div>
        <i className="fas fa-external-link-alt text-gray-400 text-sm"></i>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {change}
          </span>
          <span className="text-xs text-gray-500">Since last month</span>
        </div>
      </div>
    </Card>
  );
  const Dashboard = () => (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          icon="fas fa-boxes"
          title="Total Stock"
          value="23,340 Units"
          change="+25%"
          color="bg-green-500"
          trend="up"
        />
        <MetricCard
          icon="fas fa-dollar-sign"
          title="Total Inventory Value"
          value="$23,56847"
          change="+25%"
          color="bg-yellow-500"
          trend="up"
        />
        <MetricCard
          icon="fas fa-bullseye"
          title="Total Picking Accuracy"
          value="90%"
          change="+4%"
          color="bg-blue-500"
          trend="up"
        />
        <MetricCard
          icon="fas fa-clock"
          title="Pending Orders"
          value="7350"
          change="+7%"
          color="bg-purple-500"
          trend="up"
        />
        <MetricCard
          icon="fas fa-exclamation-triangle"
          title="Low Stock Items"
          value="152 Units"
          change="-10%"
          color="bg-red-500"
          trend="down"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-2xl font-bold text-gray-900">$16500</span>
                <span className="text-sm font-medium text-green-600">
                  +15% Compared to last month
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-sm cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-calendar mr-2"></i>
              Monthly
            </Button>
          </div>
          <div className="h-64 bg-gradient-to-t from-yellow-50 to-transparent rounded-lg flex items-end justify-center">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20business%20revenue%20growth%20chart%20with%20yellow%20and%20green%20lines%20showing%20upward%20trend%20on%20clean%20white%20background%20minimal%20design%20professional%20analytics%20dashboard%20visualization&width=600&height=300&seq=revenue-chart-001&orientation=landscape"
              alt="Revenue Chart"
              className="w-full h-full object-cover object-top rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Profit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Investment</span>
            </div>
          </div>
        </Card>
        {/* Location & Capacity */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue by Locations
              </h3>
            </div>
            <div className="relative h-48 bg-gray-900 rounded-lg overflow-hidden mb-4">
              <img
                src="https://readdy.ai/api/search-image?query=world%20map%20with%20location%20pins%20showing%20business%20distribution%20dark%20background%20with%20yellow%20and%20blue%20location%20markers%20professional%20business%20analytics%20visualization&width=400&height=200&seq=world-map-001&orientation=landscape"
                alt="World Map"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-sm">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt text-yellow-500"></i>
                  <span className="font-semibold">China</span>
                </div>
                <p className="text-xs text-gray-600">$15K Sales</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-flag text-yellow-500"></i>
                  <span className="text-sm font-medium">United Kingdom</span>
                </div>
                <span className="text-sm font-semibold">40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white !rounded-button whitespace-nowrap cursor-pointer">
              See All
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Capacity Guide
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Monitor Warehouse Space Efficiency
            </p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-green-400"
                style={{
                  clipPath:
                    "polygon(50% 50%, 50% 0%, 100% 0%, 100% 82%, 50% 50%)",
                }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">82%</div>
                  <div className="text-xs text-gray-600">Capacity</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Products are in Warning Zone</span>
                </div>
                <span className="font-semibold">36%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Products are in Risk Zone</span>
                </div>
                <span className="font-semibold">8%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dead Stocks</span>
                <span className="text-lg font-bold">25 Items</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-red-600 font-medium">-10%</span>
                <span className="text-xs text-gray-500">Since last month</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales & Orders
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search products..."
                  className="pl-8 pr-4 py-2 w-64 text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer whitespace-nowrap"
              >
                <i className="fas fa-calendar mr-2"></i>
                Monthly
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Product Details
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Delivery Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Backpack",
                    sku: "25 in stock",
                    orderId: "#ORD100",
                    price: "$200",
                    status: "Completed",
                    statusColor: "bg-green-100 text-green-800",
                  },
                  {
                    name: "T-Shirt",
                    sku: "25 in stock",
                    orderId: "#ORD200",
                    price: "$89",
                    status: "In Progress",
                    statusColor: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    name: "Sunglasses",
                    sku: "15 in stock",
                    orderId: "#ORD300",
                    price: "$150",
                    status: "Pending",
                    statusColor: "bg-gray-100 text-gray-800",
                  },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={`https://readdy.ai/api/search-image?query=$%7Bitem.name.toLowerCase%28%29%7D%20product%20on%20clean%20white%20background%20minimal%20ecommerce%20style%20professional%20product%20photography&width=100&height=100&seq=product-${index}&orientation=squarish`}
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {item.orderId}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {item.price}
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
                          className="p-1 cursor-pointer"
                        >
                          <i className="fas fa-edit text-gray-600 text-xs"></i>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-1 cursor-pointer"
                        >
                          <i className="fas fa-trash text-red-600 text-xs"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Best Selling Products
              </h3>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <i className="fas fa-external-link-alt text-xs"></i>
              </Button>
            </div>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src="https://readdy.ai/api/search-image?query=trendy%20fashion%20clothing%20t-shirts%20hanging%20on%20display%20modern%20retail%20store%20clean%20white%20background%20professional%20product%20showcase&width=400&height=200&seq=bestselling-001&orientation=landscape"
                alt="Best Selling Products"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Newly Arrived Stock
            </h3>
            <div className="space-y-4">
              {[
                { sku: "SKU-300", name: "Headphone", qty: 200, price: "$4K" },
                { sku: "SKU-300", name: "Bottle", qty: 240, price: "$6K" },
                { sku: "SKU-300", name: "Helmet", qty: 500, price: "$12K" },
                { sku: "SKU-300", name: "Shoes", qty: 100, price: "$3K" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={`https://readdy.ai/api/search-image?query=$%7Bitem.name.toLowerCase%28%29%7D%20product%20icon%20on%20clean%20white%20background%20minimal%20style%20professional%20ecommerce&width=50&height=50&seq=newstock-${index}&orientation=squarish`}
                      alt={item.name}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.sku}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.qty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
  const InventoryManagement = () => (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <i className="fas fa-plus mr-2"></i>
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
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            <Button
              variant="outline"
              className="cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-filter mr-2"></i>
              Filter
            </Button>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-download mr-2"></i>
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
                        <i className="fas fa-edit text-gray-600 text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <i className="fas fa-eye text-gray-600 text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <i className="fas fa-trash text-red-600 text-xs"></i>
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
              <i className="fas fa-chevron-left"></i>
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
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
  const SupplierManagement = () => (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Supplier Management
        </h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <i className="fas fa-plus mr-2"></i>
          Add New Supplier
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-truck text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-600">Total Suppliers</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-check-circle text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">142</p>
          <p className="text-sm text-gray-600">Active Suppliers</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-clock text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-sm text-gray-600">Pending Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-star text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search suppliers..."
                className="pl-10 pr-4 py-2 w-80 text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            <Button
              variant="outline"
              className="cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-filter mr-2"></i>
              Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Products
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Orders
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Rating
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
                  name: "TechSupply Co.",
                  contact: "john@techsupply.com",
                  location: "New York, USA",
                  products: 45,
                  orders: 128,
                  rating: 4.9,
                  status: "Active",
                },
                {
                  name: "Global Electronics",
                  contact: "sarah@globalelec.com",
                  location: "London, UK",
                  products: 78,
                  orders: 256,
                  rating: 4.7,
                  status: "Active",
                },
                {
                  name: "Fashion Forward",
                  contact: "mike@fashionfw.com",
                  location: "Paris, France",
                  products: 123,
                  orders: 89,
                  rating: 4.8,
                  status: "Pending",
                },
                {
                  name: "Sports Gear Ltd",
                  contact: "emma@sportsgear.com",
                  location: "Berlin, Germany",
                  products: 67,
                  orders: 145,
                  rating: 4.6,
                  status: "Active",
                },
              ].map((supplier, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <i className="fas fa-building text-gray-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {supplier.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {supplier.contact}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {supplier.location}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {supplier.products}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {supplier.orders}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-star text-yellow-400 text-xs"></i>
                      <span className="text-sm font-medium text-gray-900">
                        {supplier.rating}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`${supplier.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {supplier.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <i className="fas fa-edit text-gray-600 text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <i className="fas fa-eye text-gray-600 text-xs"></i>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 cursor-pointer"
                      >
                        <i className="fas fa-envelope text-gray-600 text-xs"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
  const OrderManagement = () => (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <i className="fas fa-plus mr-2"></i>
          Create New Order
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-shopping-cart text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-clock text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">89</p>
          <p className="text-sm text-gray-600">Pending Orders</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-truck text-xl text-white"></i>
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-600">In Transit</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-check-circle text-xl text-white"></i>
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
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 w-80 text-sm"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
                <Button
                  variant="outline"
                  className="cursor-pointer whitespace-nowrap"
                >
                  <i className="fas fa-filter mr-2"></i>
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
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Products
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Total Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Order Date
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
                    ].map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-sm font-mono text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <i className="fas fa-building text-gray-600 text-xs"></i>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {order.customer}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {order.products} items
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          ${order.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={`${order.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                            >
                              <i className="fas fa-eye text-gray-600 text-xs"></i>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                            >
                              <i className="fas fa-edit text-gray-600 text-xs"></i>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                            >
                              <i className="fas fa-truck text-gray-600 text-xs"></i>
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
  const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="main-content transition-opacity duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return <LoginPage />;
      case "dashboard":
        return (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        );
      case "inventory":
        return (
          <MainLayout>
            <InventoryManagement />
          </MainLayout>
        );
      case "suppliers":
        return (
          <MainLayout>
            <SupplierManagement />
          </MainLayout>
        );
      case "orders":
        return (
          <MainLayout>
            <OrderManagement />
          </MainLayout>
        );
      default:
        return (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        );
    }
  };
  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      {/* Navigation Demo Buttons */}
    </div>
  );
};
export default App;
