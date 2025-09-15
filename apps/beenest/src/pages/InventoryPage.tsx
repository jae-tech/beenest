import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">재고 관리</h1>
          <p className="text-gray-600">재고 현황을 실시간으로 관리하세요</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          재고 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>재고 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            재고 데이터가 없습니다. 새 재고를 추가해보세요.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}