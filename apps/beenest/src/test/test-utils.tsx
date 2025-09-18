import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory } from '@tanstack/react-router'
import { Router, RouterProvider } from '@tanstack/react-router'

// Test helper for rendering components with providers
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllTheProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
}

const AllTheProviders = ({ children, queryClient }: AllTheProvidersProps) => {
  const testQueryClient = queryClient || createTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient
  }
) => {
  const { queryClient, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} queryClient={queryClient} />,
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }