import { useOrders } from '../hooks/useOrders'
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export const OrdersPage = () => {
  const { stats, orders, tabs, activeTab, setActiveTab, isLoading, error, refetch } = useOrders()

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />Create New Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color.replace('bg-', 'bg-').replace('-500', '-100')} p-3 rounded-full`}>
                {/* Note: This needs to be updated to render lucide-react icons dynamically based on stat.icon */}
                <i className={`${stat.icon} ${stat.color.replace('bg-', 'text-').replace('-500', '-600')}`}></i>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                placeholder="Search orders..."
                className="pl-8 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-md focus:border-yellow-400 focus:ring-yellow-400"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <Filter className="w-4 h-4 mr-2" />Filter
            </button>
            <button className="border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />Export
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

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
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {order.items}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {order.total}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {order.date}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="border border-gray-200 p-1 rounded cursor-pointer hover:bg-gray-50">
                        <Eye className="w-3 h-3 text-gray-600" />
                      </button>
                      <button className="border border-gray-200 p-1 rounded cursor-pointer hover:bg-gray-50">
                        <Edit className="w-3 h-3 text-gray-600" />
                      </button>
                      <button className="border border-gray-200 p-1 rounded cursor-pointer hover:bg-gray-50">
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing 1-{orders.length} of {orders.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="bg-yellow-400 text-black px-2 py-1 rounded text-sm cursor-pointer">
              1
            </button>
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              2
            </button>
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}