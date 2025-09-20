import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { api } from '@/lib/api-client'
import type { User as ApiUser } from '@/types/api'

// React Query를 사용한 인증 확인 hook (캐싱 및 중복 요청 방지)
export function useAuthQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await api.get<ApiUser>("/auth/me")
      return response
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false, // 인증 실패 시 재시도 안함
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}