import { useState, useEffect } from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { Card } from './card'
import {
  TestTube,
  Database,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { resetDemoData } from '@/lib/demo-data'

export const DemoModeToggle = () => {
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const demoMode = localStorage.getItem('demo-mode') !== 'false'
    setIsDemoMode(demoMode)
  }, [])

  const toggleDemoMode = () => {
    const newMode = !isDemoMode
    setIsDemoMode(newMode)
    localStorage.setItem('demo-mode', newMode.toString())

    if (newMode) {
      resetDemoData()
    }

    // 페이지 새로고침하여 변경사항 적용
    window.location.reload()
  }

  const handleResetDemo = () => {
    if (confirm('데모 데이터를 초기 상태로 리셋하시겠습니까?')) {
      resetDemoData()
      window.location.reload()
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Eye className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 max-w-sm bg-white shadow-lg border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TestTube className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">개발 모드</span>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6"
        >
          <EyeOff className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">데모 데이터 모드</span>
          <Badge variant={isDemoMode ? "default" : "secondary"} className="text-xs">
            {isDemoMode ? "활성" : "비활성"}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={toggleDemoMode}
            variant={isDemoMode ? "outline" : "default"}
            size="sm"
            className="flex-1 text-xs"
          >
            <Database className="h-3 w-3 mr-1" />
            {isDemoMode ? "실제 API" : "데모 모드"}
          </Button>

          {isDemoMode && (
            <Button
              onClick={handleResetDemo}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>

        {isDemoMode && (
          <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-700">
              현재 데모 모드입니다. 로컬 저장소를 사용하여 데이터가 저장됩니다.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}