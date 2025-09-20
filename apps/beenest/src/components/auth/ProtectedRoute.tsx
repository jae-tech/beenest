import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/app/store/authStore';
import { LoadingPage } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // checkAuth 호출 제거 - useAuth hook에서 이미 처리됨

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: redirectTo,
        search: {
          redirect: window.location.pathname
        }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  if (isLoading) {
    return <LoadingPage message="인증 확인 중..." />;
  }

  if (!isAuthenticated) {
    return <LoadingPage message="로그인 페이지로 이동 중..." />;
  }

  return <>{children}</>;
}

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return fallback || <LoadingPage message="인증 확인 중..." />;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicOnlyRoute({ children, redirectTo = '/dashboard' }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: redirectTo });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  if (isLoading) {
    return <LoadingPage message="인증 확인 중..." />;
  }

  if (isAuthenticated) {
    return <LoadingPage message="대시보드로 이동 중..." />;
  }

  return <>{children}</>;
}