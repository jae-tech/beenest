import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 통화 포맷팅 (Intl API 사용)
export function formatCurrency(value: number, options?: {
  compact?: boolean
  currency?: string
  locale?: string
}): string {
  const { compact = false, currency = 'KRW', locale = 'ko-KR' } = options || {}

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(value)
}

// 퍼센트 포맷팅 함수
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// 날짜 포맷팅 함수
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`
    case 'relative':
      return getRelativeTime(d)
    default:
      return d.toLocaleDateString()
  }
}

// 상대적 시간 포맷팅
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInDays > 0) {
    return `${diffInDays}일 전`
  } else if (diffInHours > 0) {
    return `${diffInHours}시간 전`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`
  } else {
    return '방금 전'
  }
}

// 재고 상태 계산
export function getStockStatus(current: number, minimum: number): 'ok' | 'low' | 'out' {
  if (current <= 0) return 'out'
  if (current <= minimum) return 'low'
  return 'ok'
}

// 재고 상태 메시지
export function getStockStatusMessage(current: number, minimum: number): string {
  const status = getStockStatus(current, minimum)

  switch (status) {
    case 'out':
      return '품절'
    case 'low':
      return '재고 부족'
    case 'ok':
      return '재고 있음'
  }
}

// 수량 유효성 검사
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 0
}

// 가격 유효성 검사
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && Number.isFinite(price)
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 전화번호 포맷팅
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phone
}

// 검색어 하이라이트
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 배열 청크 분할
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// 디바운스 함수
export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
