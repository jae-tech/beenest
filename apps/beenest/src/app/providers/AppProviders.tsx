import { Toaster } from 'sonner'
import { QueryProvider } from './QueryProvider'
import { RouterProvider } from './RouterProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/lib/auth'

export function AppProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <RouterProvider />
          <Toaster
            position="top-right"
            richColors
            expand={true}
            duration={4000}
            closeButton
            toastOptions={{
              style: {
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
              },
            }}
          />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}