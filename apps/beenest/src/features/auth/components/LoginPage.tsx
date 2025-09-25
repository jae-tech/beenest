import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .max(50, '비밀번호는 최대 50자까지 입력 가능합니다'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginPageProps {
  onLoginSuccess?: () => void
  redirectTo?: string
  className?: string
}

export const LoginPage = ({
  onLoginSuccess,
  redirectTo = '/dashboard',
  className = ''
}: LoginPageProps) => {
  const { login, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      onLoginSuccess?.()
    } catch (err) {
      setError('root', {
        message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      })
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md">
        <div className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4">
              <i className="fas fa-cube text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beenest</h1>
            <p className="text-gray-600">거래처 및 재고 관리 시스템</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="이메일을 입력하세요"
                className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="h-5 w-5 text-gray-400">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <span>로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: 비밀번호 찾기 기능 구현
                }}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {(error || errors.root) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">
                  {error || errors.root?.message}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-12 font-semibold whitespace-nowrap cursor-pointer"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </span>
              ) : (
                'Beenest에 로그인'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              계정이 없으신가요?
              <button className="text-yellow-600 hover:text-yellow-700 font-medium ml-1 cursor-pointer">
                영업팀 문의
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}