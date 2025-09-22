import { useState, useEffect } from 'react'
import { X, Bell, AlertTriangle, Package, TrendingDown } from 'lucide-react'
import { Card } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { useDemoProducts } from '@/hooks/useDemoData'

interface Notification {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'high_demand'
  title: string
  message: string
  productId?: string
  productName?: string
  timestamp: Date
  read: boolean
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { products } = useDemoProducts()

  // 재고 알림 생성
  useEffect(() => {
    if (products.length === 0) return

    const newNotifications: Notification[] = []

    products.forEach((product) => {
      const currentStock = product.inventory?.currentStock || 0
      const minimumStock = product.inventory?.minimumStock || 5

      // 재고 부족 알림
      if (currentStock <= minimumStock && currentStock > 0) {
        newNotifications.push({
          id: `low_stock_${product.id}`,
          type: 'low_stock',
          title: '재고 부족 경고',
          message: `${product.productName}의 재고가 부족합니다 (현재: ${currentStock}개)`,
          productId: product.id,
          productName: product.productName,
          timestamp: new Date(),
          read: false,
        })
      }

      // 품절 알림
      if (currentStock === 0) {
        newNotifications.push({
          id: `out_of_stock_${product.id}`,
          type: 'out_of_stock',
          title: '품절 알림',
          message: `${product.productName}이 품절되었습니다`,
          productId: product.id,
          productName: product.productName,
          timestamp: new Date(),
          read: false,
        })
      }
    })

    // 기존 알림과 중복 제거하여 업데이트
    setNotifications((prev) => {
      const existingIds = prev.map(n => n.id)
      const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id))
      return [...prev, ...filteredNew]
    })
  }, [products])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'out_of_stock':
        return <Package className="h-4 w-4 text-red-500" />
      case 'high_demand':
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'out_of_stock':
        return 'border-l-red-500 bg-red-50'
      case 'high_demand':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-20 z-40 bg-white shadow-lg"
      >
        <Bell className="h-4 w-4 mr-2" />
        알림
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2 px-1 min-w-[20px] h-5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-96 max-h-[500px] bg-white shadow-xl border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">알림</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {notifications.length > 0 && (
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              모두 읽음
            </Button>
            <Button
              onClick={clearAllNotifications}
              variant="outline"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
            >
              모두 삭제
            </Button>
          </div>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>새로운 알림이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {notifications
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-l-4 rounded-r-md cursor-pointer transition-colors hover:bg-gray-50 ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'bg-opacity-80' : 'bg-opacity-40'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  )
}