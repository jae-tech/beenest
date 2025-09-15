import { useUIStore } from '@/app/store/uiStore'

interface HeaderProps {
  className?: string
}

export const Header = ({ className = '' }: HeaderProps) => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
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
            <input
              placeholder="Search inventory, orders, customers..."
              className="w-80 pl-10 pr-4 py-2 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm rounded-md border"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <button className="p-2 border-gray-200 hover:bg-gray-50 cursor-pointer border rounded">
            <i className="fas fa-sliders-h text-gray-600"></i>
          </button>
          <button className="p-2 border-gray-200 hover:bg-gray-50 relative cursor-pointer border rounded">
            <i className="fas fa-bell text-gray-600"></i>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
            <i className="fas fa-plus mr-2"></i>
            Add New Product
          </button>
        </div>
      </div>
    </div>
  )
}