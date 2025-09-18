// 환경 변수 타입 정의 및 검증

export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Beenest',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
} as const

// 환경 변수 검증
export function validateEnv() {
  if (!env.API_URL) {
    throw new Error('VITE_API_URL is required')
  }

  console.log('Environment:', {
    NODE_ENV: env.NODE_ENV,
    API_URL: env.API_URL,
    APP_NAME: env.APP_NAME,
  })
}

// 개발 환경에서만 검증 실행
if (env.DEV) {
  validateEnv()
}