import { useAuthStore } from "@/app/store/authStore";
import { useEffect, useRef } from "react";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setLoading,
    clearError,
    checkAuth,
    refreshAuth,
  } = useAuthStore();

  // 중복 실행 방지를 위한 ref
  const hasCheckedAuth = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 앱 시작 시 인증 상태 확인 (한번만)
  useEffect(() => {
    if (!hasCheckedAuth.current && !isAuthenticated) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []); // 의존성 배열에서 checkAuth 제거

  // 토큰 갱신 (선택적 - 필요한 경우)
  useEffect(() => {
    // 기존 interval 정리
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (isAuthenticated) {
      refreshIntervalRef.current = setInterval(
        () => {
          refreshAuth();
        },
        15 * 60 * 1000
      ); // 15분마다 토큰 갱신
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated]); // refreshAuth 의존성 제거

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setLoading,
    clearError,
    checkAuth,
    refreshAuth,
  };
};
