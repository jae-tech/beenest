import { toast } from 'sonner'

// 성공 토스트
export const successToast = (message: string) => {
  return toast.success(message, {
    duration: 4000,
  })
}

// 에러 토스트
export const errorToast = (message: string) => {
  return toast.error(message, {
    duration: 5000, // 에러는 조금 더 오래 표시
  })
}

// 경고 토스트
export const warningToast = (message: string) => {
  return toast.warning(message, {
    duration: 4000,
  })
}

// 정보 토스트
export const infoToast = (message: string) => {
  return toast.info(message, {
    duration: 4000,
  })
}

// 로딩 토스트
export const loadingToast = (message: string) => {
  return toast.loading(message, {
    duration: Infinity, // 수동으로 닫을 때까지 표시
  })
}

// 로딩 토스트 업데이트
export const updateLoadingToast = (toastId: string | number, message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    toast.success(message, {
      id: toastId,
      duration: 4000,
    })
  } else {
    toast.error(message, {
      id: toastId,
      duration: 5000,
    })
  }
}

// 프로미스 기반 토스트 (API 호출용)
export const promiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: Error) => string)
  }
) => {
  return toast.promise(promise, messages)
}

// 커스텀 토스트 (JSX 컨텐츠 포함)
export const customToast = (content: React.ReactNode, options?: Record<string, unknown>) => {
  return toast.custom(() => content as React.ReactElement, options)
}

// 모든 토스트 닫기
export const dismissAllToasts = () => {
  toast.dismiss()
}

// 특정 토스트 닫기
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId)
}

// API 에러 메시지 처리
export const handleApiError = (error: { error?: { message?: string }; message?: string } | Error) => {
  const errorObj = error as any;
  const message = errorObj?.error?.message || errorObj?.message || '알 수 없는 오류가 발생했습니다.'
  errorToast(message)
}

// API 성공 메시지 처리
export const handleApiSuccess = (message: string = '작업이 성공적으로 완료되었습니다.') => {
  successToast(message)
}