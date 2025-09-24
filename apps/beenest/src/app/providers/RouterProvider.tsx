import { RouterProvider as TanStackRouterProvider, createRouter } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useEffect, useMemo, useState } from 'react'
import { BrandLoadingScreen } from '@/components/loading/BrandLoadingScreen'

// 자동 생성될 routeTree import
import { routeTree } from '@/routeTree.gen'

// 라우터 인스턴스 생성
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  }
})

// 타입 안전성을 위한 등록
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function RouterProvider() {
  const auth = useAuth()
  const [isRouterReady, setIsRouterReady] = useState(false)

  // auth 상태가 변경될 때마다 context 업데이트
  const contextValue = useMemo(() => ({ auth }), [auth])

  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user?.email
    })
  }, [auth.isAuthenticated, auth.user])

  useEffect(() => {
    // 라우터가 준비되었음을 표시
    setIsRouterReady(true)
  }, [])

  if (!isRouterReady) {
    return <BrandLoadingScreen />
  }

  return <TanStackRouterProvider router={router} context={contextValue} />
}