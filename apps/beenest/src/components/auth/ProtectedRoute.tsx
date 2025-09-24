import React from 'react';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import { TableSkeleton } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 로딩 중에 표시할 컴포넌트 */
  fallback?: React.ReactNode;
  /** 추가 권한 확인 로직 */
  requiredRole?: string;
  /** 권한 부족 시 표시할 메시지 */
  unauthorizedMessage?: string;
}

/**
 * 보호된 라우트 컴포넌트
 * 인증된 사용자만 접근할 수 있는 컴포넌트를 래핑
 */
export function ProtectedRoute({
  children,
  fallback,
  requiredRole,
  unauthorizedMessage = '이 페이지에 접근할 권한이 없습니다.',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useRequireAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {fallback || <TableSkeleton />}
      </div>
    );
  }

  // 인증되지 않았을 때 (useRequireAuth가 자동으로 리다이렉트 처리)
  if (!isAuthenticated) {
    return null;
  }

  // 특정 역할이 필요한 경우 권한 확인
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            접근 권한 없음
          </h2>
          <p className="text-gray-600 mb-4">{unauthorizedMessage}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 인증 및 권한 확인 완료, 자식 컴포넌트 렌더링
  return <>{children}</>;
}

/**
 * 관리자 전용 보호된 라우트 컴포넌트
 */
export function AdminProtectedRoute({
  children,
  fallback,
}: Omit<ProtectedRouteProps, 'requiredRole' | 'unauthorizedMessage'>) {
  return (
    <ProtectedRoute
      requiredRole="ADMIN"
      unauthorizedMessage="관리자만 접근할 수 있는 페이지입니다."
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}
