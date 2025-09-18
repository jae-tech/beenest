import { describe, it, expect, vi } from 'vitest'
import {
  cn,
  formatPrice,
  formatPercent,
  formatDate,
  getRelativeTime,
  getStockStatus,
  getStockStatusMessage,
  isValidQuantity,
  isValidPrice,
  isValidEmail,
  formatPhoneNumber,
  highlightSearchTerm,
  chunkArray,
  debounce,
} from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toContain('class1')
      expect(cn('class1', 'class2')).toContain('class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toContain('conditional')
      expect(cn('base', false && 'conditional')).not.toContain('conditional')
    })
  })

  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(formatPrice(1000)).toBe('₩1,000')
      expect(formatPrice(1234567)).toBe('₩1,234,567')
    })

    it('should format price with custom currency', () => {
      expect(formatPrice(1000, '$')).toBe('$1,000')
      expect(formatPrice(1000, '€')).toBe('€1,000')
    })

    it('should handle decimal values', () => {
      expect(formatPrice(1234.56)).toBe('₩1,234.56')
    })
  })

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercent(12.345)).toBe('12.3%')
      expect(formatPercent(100)).toBe('100.0%')
    })

    it('should format percentage with custom decimals', () => {
      expect(formatPercent(12.345, 2)).toBe('12.35%')
      expect(formatPercent(12.345, 0)).toBe('12%')
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T10:30:00')

    it('should format date with default format', () => {
      expect(formatDate(testDate)).toBe('2024-03-15')
    })

    it('should format date with MM/DD/YYYY format', () => {
      expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('03/15/2024')
    })

    it('should format date with time', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD HH:mm')).toBe('2024-03-15 10:30')
    })

    it('should handle string date input', () => {
      expect(formatDate('2024-03-15')).toBe('2024-03-15')
    })
  })

  describe('getRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T12:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "방금 전" for recent times', () => {
      const recent = new Date('2024-03-15T11:59:30')
      expect(getRelativeTime(recent)).toBe('방금 전')
    })

    it('should return minutes for times within an hour', () => {
      const thirtyMinutesAgo = new Date('2024-03-15T11:30:00')
      expect(getRelativeTime(thirtyMinutesAgo)).toBe('30분 전')
    })

    it('should return hours for times within a day', () => {
      const twoHoursAgo = new Date('2024-03-15T10:00:00')
      expect(getRelativeTime(twoHoursAgo)).toBe('2시간 전')
    })

    it('should return days for older times', () => {
      const threeDaysAgo = new Date('2024-03-12T12:00:00')
      expect(getRelativeTime(threeDaysAgo)).toBe('3일 전')
    })
  })

  describe('getStockStatus', () => {
    it('should return "out" when stock is 0', () => {
      expect(getStockStatus(0, 10)).toBe('out')
    })

    it('should return "out" when stock is negative', () => {
      expect(getStockStatus(-1, 10)).toBe('out')
    })

    it('should return "low" when stock is at or below minimum', () => {
      expect(getStockStatus(5, 10)).toBe('low')
      expect(getStockStatus(10, 10)).toBe('low')
    })

    it('should return "ok" when stock is above minimum', () => {
      expect(getStockStatus(15, 10)).toBe('ok')
    })
  })

  describe('getStockStatusMessage', () => {
    it('should return correct messages for different stock levels', () => {
      expect(getStockStatusMessage(0, 10)).toBe('품절')
      expect(getStockStatusMessage(5, 10)).toBe('재고 부족')
      expect(getStockStatusMessage(15, 10)).toBe('재고 있음')
    })
  })

  describe('isValidQuantity', () => {
    it('should validate positive integers', () => {
      expect(isValidQuantity(0)).toBe(true)
      expect(isValidQuantity(10)).toBe(true)
      expect(isValidQuantity(100)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(isValidQuantity(-1)).toBe(false)
      expect(isValidQuantity(-10)).toBe(false)
    })

    it('should reject decimal numbers', () => {
      expect(isValidQuantity(10.5)).toBe(false)
      expect(isValidQuantity(0.1)).toBe(false)
    })

    it('should reject non-numbers', () => {
      expect(isValidQuantity(NaN)).toBe(false)
      expect(isValidQuantity(Infinity)).toBe(false)
    })
  })

  describe('isValidPrice', () => {
    it('should validate positive numbers', () => {
      expect(isValidPrice(0)).toBe(true)
      expect(isValidPrice(10)).toBe(true)
      expect(isValidPrice(10.99)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(isValidPrice(-1)).toBe(false)
      expect(isValidPrice(-10.5)).toBe(false)
    })

    it('should reject non-finite numbers', () => {
      expect(isValidPrice(NaN)).toBe(false)
      expect(isValidPrice(Infinity)).toBe(false)
      expect(isValidPrice(-Infinity)).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.kr')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid.email')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('user name@domain.com')).toBe(false)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 11-digit phone numbers', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
    })

    it('should format 10-digit phone numbers', () => {
      expect(formatPhoneNumber('0212345678')).toBe('021-234-5678')
    })

    it('should return original for invalid lengths', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('123456789012')).toBe('123456789012')
    })

    it('should handle non-digit characters', () => {
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
      expect(formatPhoneNumber('010.1234.5678')).toBe('010-1234-5678')
    })
  })

  describe('highlightSearchTerm', () => {
    it('should highlight search terms', () => {
      expect(highlightSearchTerm('Hello World', 'World')).toBe('Hello <mark>World</mark>')
      expect(highlightSearchTerm('Test String', 'test')).toBe('<mark>Test</mark> String')
    })

    it('should handle case-insensitive search', () => {
      expect(highlightSearchTerm('Hello World', 'hello')).toBe('<mark>Hello</mark> World')
    })

    it('should return original text when no search term', () => {
      expect(highlightSearchTerm('Hello World', '')).toBe('Hello World')
    })

    it('should highlight multiple occurrences', () => {
      expect(highlightSearchTerm('test test test', 'test')).toBe('<mark>test</mark> <mark>test</mark> <mark>test</mark>')
    })
  })

  describe('chunkArray', () => {
    it('should split array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const chunks = chunkArray(array, 3)

      expect(chunks).toHaveLength(3)
      expect(chunks[0]).toEqual([1, 2, 3])
      expect(chunks[1]).toEqual([4, 5, 6])
      expect(chunks[2]).toEqual([7, 8, 9])
    })

    it('should handle arrays that don\'t divide evenly', () => {
      const array = [1, 2, 3, 4, 5]
      const chunks = chunkArray(array, 2)

      expect(chunks).toHaveLength(3)
      expect(chunks[0]).toEqual([1, 2])
      expect(chunks[1]).toEqual([3, 4])
      expect(chunks[2]).toEqual([5])
    })

    it('should handle empty arrays', () => {
      expect(chunkArray([], 3)).toEqual([])
    })
  })

  describe('debounce', () => {
    it('should delay function execution', () => {
      vi.useFakeTimers()

      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')

      vi.useRealTimers()
    })

    it('should reset timer on subsequent calls', () => {
      vi.useFakeTimers()

      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      vi.advanceTimersByTime(50)

      debouncedFn('second')
      vi.advanceTimersByTime(50)

      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(mockFn).toHaveBeenCalledOnce()
      expect(mockFn).toHaveBeenCalledWith('second')

      vi.useRealTimers()
    })
  })
})