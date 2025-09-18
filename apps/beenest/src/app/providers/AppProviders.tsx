import { Toaster } from 'react-hot-toast'
import { QueryProvider } from './QueryProvider'
import { RouterProvider } from './RouterProvider'

export function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            maxWidth: '400px',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#6b7280',
              color: '#fff',
            },
          },
        }}
      />
    </QueryProvider>
  )
}