import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export const MainLayout = ({ children, className = '' }: MainLayoutProps) => (
  <div className={`flex h-screen bg-gray-50 ${className}`}>
    <Sidebar isCollapsed={false} onToggle={() => {}} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="main-content transition-opacity duration-300">
          {children}
        </div>
      </main>
    </div>
  </div>
)