import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/app/store/uiStore'
import { cn } from '@/shared/lib/utils'

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          !sidebarCollapsed ? 'ml-64' : 'ml-16'
        )}
      >
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="main-content transition-opacity duration-300">
            <Outlet />
          </div>
        </main>
      </div>
      <TanStackRouterDevtools />
    </div>
  )
}