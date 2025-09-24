import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/app/store/authStore';

interface UseAuthGuardOptions {
  /** 인증이 필요하지 않은 페이지인지 여부 */
  public?: boolean;
  /** 리다이렉트할 경로 (기본값: '/login') */
  redirectTo?: string;
  /** 인증 확인 후 실행할 콜백 */
  onAuthCheck?: (isAuthenticated: boolean) => void;
}

/**
 * 인증 가드 훅
 * 페이지 접근 권한을 확인하고 미인증 시 리다이렉트 처리
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { public: isPublic = false, redirectTo = '/login', onAuthCheck } = options;
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();

  useEffect(() => {
    // 공개 페이지라면 인증 체크 불필요
    if (isPublic) {
      onAuthCheck?.(isAuthenticated);
      return;
    }

    // 로딩 중이 아닐 때만 체크
    if (!isLoading) {
      // 토큰이 있으면 인증 상태 재확인
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (token && !isAuthenticated) {
        checkAuth();
        return;
      }

      // 인증되지 않았다면 로그인 페이지로 리다이렉트
      if (!isAuthenticated) {
        // 현재 경로를 저장해서 로그인 후 돌아올 수 있도록
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== redirectTo && currentPath !== '/login' && currentPath !== '/register') {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }

        navigate({ to: redirectTo });
        return;
      }

      onAuthCheck?.(isAuthenticated);
    }
  }, [isAuthenticated, isLoading, isPublic, redirectTo, navigate, checkAuth, onAuthCheck]);

  // 초기 로드 시 인증 상태 확인
  useEffect(() => {
    if (!isPublic && !isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    /** 수동으로 인증 상태 재확인 */
    recheck: checkAuth,
  };
}

/**
 * 보호된 라우트에서 사용할 간단한 인증 가드 훅
 */
export function useRequireAuth() {
  return useAuthGuard({ public: false });
}

/**
 * 공개 라우트에서 사용할 인증 상태 확인 훅
 */
export function usePublicAuth() {
  return useAuthGuard({ public: true });
}

/**
 * 로그인 후 리다이렉트 처리 훅
 */
export function useLoginRedirect() {
  const navigate = useNavigate();

  const redirectAfterLogin = () => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      navigate({ to: redirectPath });
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  return { redirectAfterLogin };
}