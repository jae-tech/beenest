import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/app/store/uiStore'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}