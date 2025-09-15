import { useUIStore } from '@/app/store/uiStore'

interface SidebarProps {
  className?: string
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} min-h-screen flex flex-col ${className}`}>
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
            { icon: "fas fa-chart-line", label: "Dashboard", active: true },
            { icon: "fas fa-boxes", label: "Inventory" },
            { icon: "fas fa-shipping-fast", label: "Shipment" },
            { icon: "fas fa-users", label: "Customers" },
            { icon: "fas fa-store", label: "Suppliers" },
            { icon: "fas fa-chart-bar", label: "Reports" },
          ].map((item, index) => (
            <button
              key={index}
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
          <div className="p-4 bg-gray-800 border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <i className="fas fa-crown text-black text-sm"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Upgrade to Pro
                </h4>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Unlock premium features with 20% off - for a limited time!
            </p>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-semibold !rounded-button whitespace-nowrap cursor-pointer py-2 px-3 rounded">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}