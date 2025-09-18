import toast from 'react-hot-toast'

// 토스트 스타일 설정
const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '8px',
    background: '#363636',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '400px',
  },
}

// 성공 토스트
export const successToast = (message: string) => {
  return toast.success(message, {
    ...toastOptions,
    style: {
      ...toastOptions.style,
      background: '#10b981',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  })
}

// 에러 토스트
export const errorToast = (message: string) => {
  return toast.error(message, {
    ...toastOptions,
    duration: 5000, // 에러는 조금 더 오래 표시
    style: {
      ...toastOptions.style,
      background: '#ef4444',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  })
}

// 경고 토스트
export const warningToast = (message: string) => {
  return toast(message, {
    ...toastOptions,
    icon: '⚠️',
    style: {
      ...toastOptions.style,
      background: '#f59e0b',
    },
  })
}

// 정보 토스트
export const infoToast = (message: string) => {
  return toast(message, {
    ...toastOptions,
    icon: 'ℹ️',
    style: {
      ...toastOptions.style,
      background: '#3b82f6',
    },
  })
}

// 로딩 토스트
export const loadingToast = (message: string) => {
  return toast.loading(message, {
    ...toastOptions,
    duration: Infinity, // 수동으로 닫을 때까지 표시
    style: {
      ...toastOptions.style,
      background: '#6b7280',
    },
  })
}

// 로딩 토스트 업데이트
export const updateLoadingToast = (toastId: string, message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    toast.success(message, {
      id: toastId,
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: '#10b981',
      },
    })
  } else {
    toast.error(message, {
      id: toastId,
      ...toastOptions,
      duration: 5000,
      style: {
        ...toastOptions.style,
        background: '#ef4444',
      },
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
  return toast.promise(promise, messages, {
    ...toastOptions,
    success: {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: '#10b981',
      },
    },
    error: {
      ...toastOptions,
      duration: 5000,
      style: {
        ...toastOptions.style,
        background: '#ef4444',
      },
    },
    loading: {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: '#6b7280',
      },
    },
  })
}

// 커스텀 토스트 (JSX 컨텐츠 포함)
export const customToast = (content: React.ReactNode, options?: Record<string, unknown>) => {
  return toast.custom(content, {
    ...toastOptions,
    ...options,
  })
}

// 모든 토스트 닫기
export const dismissAllToasts = () => {
  toast.dismiss()
}

// 특정 토스트 닫기
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

// API 에러 메시지 처리
export const handleApiError = (error: { error?: { message?: string }; message?: string } | Error) => {
  const message = error?.error?.message || error?.message || '알 수 없는 오류가 발생했습니다.'
  errorToast(message)
}

// API 성공 메시지 처리
export const handleApiSuccess = (message: string = '작업이 성공적으로 완료되었습니다.') => {
  successToast(message)
}