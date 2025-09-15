import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
          <p className="text-gray-600">주문 현황을 체계적으로 관리하세요</p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          주문 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            주문 데이터가 없습니다. 새 주문을 추가해보세요.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}