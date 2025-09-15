import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { AppView } from '@/shared/types'

interface UIState {
  sidebarCollapsed: boolean
  currentView: AppView
  theme: 'light' | 'dark'
  isLoading: boolean
  notifications: Notification[]

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentView: (view: AppView) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set, get) => ({
        sidebarCollapsed: false,
        currentView: 'dashboard',
        theme: 'light',
        isLoading: false,
        notifications: [],

        toggleSidebar: () => {
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed
          })
        },

        setSidebarCollapsed: (collapsed: boolean) => {
          set((state) => {
            state.sidebarCollapsed = collapsed
          })
        },

        setCurrentView: (view: AppView) => {
          set((state) => {
            state.currentView = view
          })
        },

        setTheme: (theme: 'light' | 'dark') => {
          set((state) => {
            state.theme = theme
          })
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading
          })
        },

        addNotification: (notification: Omit<Notification, 'id'>) => {
          set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
            }
            state.notifications.push(newNotification)
          })
        },

        removeNotification: (id: string) => {
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id)
          })
        },

        clearNotifications: () => {
          set((state) => {
            state.notifications = []
          })
        },
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: 'ui-store' }
  )
)