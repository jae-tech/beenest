import { useState } from 'react'

export type AppView = 'login' | 'dashboard' | 'inventory' | 'suppliers' | 'orders' | 'customers' | 'reports' | 'shipment'

export const useUI = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<AppView>('login')
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const navigateWithTransition = (view: AppView) => {
    const mainContent = document.querySelector(".main-content")
    if (mainContent) {
      mainContent.classList.add("opacity-0")
      setTimeout(() => {
        setCurrentView(view)
        mainContent.classList.remove("opacity-0")
      }, 300)
    } else {
      setCurrentView(view)
    }
  }

  const navigate = (view: AppView) => {
    setCurrentView(view)
  }

  const showLoading = () => {
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    currentView,
    setCurrentView: navigate,
    isLoading,
    toggleSidebar,
    navigateWithTransition,
    showLoading,
    hideLoading
  }
}