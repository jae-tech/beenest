import { Supplier } from '../hooks/useSuppliers'
import { Search, Filter, Download, Star, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface SupplierTableProps {
  suppliers: Supplier[]
}

export const SupplierTable = ({ suppliers }: SupplierTableProps) => {

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Supplier List</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              placeholder="Search suppliers..."
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Supplier Info
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Category
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Rating
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Last Order
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{supplier.name}</p>
                    <p className="text-xs text-gray-500">{supplier.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-gray-900">{supplier.contact}</p>
                    <p className="text-xs text-gray-500">{supplier.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {supplier.category}
                </td>
                <td className="py-4 px-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    supplier.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {supplier.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                    <span className="text-sm text-gray-900">{supplier.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {supplier.lastOrder}
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
          Showing 1-5 of {suppliers.length} suppliers
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
  )
}