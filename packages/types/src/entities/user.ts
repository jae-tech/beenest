import { UserRole } from '../enums/status'

// 사용자 엔티티
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

// 사용자 프로필
export interface UserProfile extends Pick<User, 'id' | 'email' | 'name' | 'avatar'> {
  companyName?: string
  phone?: string
  address?: string
}