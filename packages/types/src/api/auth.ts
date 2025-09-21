import { User } from '../entities/user'

// 로그인 요청
export interface LoginRequest {
  email: string
  password: string
  deviceId?: string
}

// 로그인 응답
export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// 회원가입 요청
export interface RegisterRequest {
  email: string
  password: string
  name: string
  companyName?: string
}

// 토큰 갱신 요청
export interface RefreshTokenRequest {
  refreshToken: string
  deviceId?: string
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// 비밀번호 변경 응답
export interface ChangePasswordResponse {
  success: boolean
  message: string
}