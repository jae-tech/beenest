import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">거래처 관리</h1>
          <p className="text-gray-600">거래처 정보를 효율적으로 관리하세요</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          거래처 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>거래처 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            거래처 데이터가 없습니다. 새 거래처를 추가해보세요.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}