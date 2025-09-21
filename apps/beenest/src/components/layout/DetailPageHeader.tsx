import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DetailPageHeaderProps {
  // 네비게이션
  backPath: string
  breadcrumbs: Array<{ label: string; path?: string }>

  // 메인 정보
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string

  // 뱃지들
  badges: Array<{ label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }>

  // 우측 정보 (선택)
  rightInfo?: {
    label: string
    value: string
    sublabel?: string
  }

  // 액션 버튼들 (선택)
  actions?: Array<{
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: 'default' | 'outline'
  }>
}

export function DetailPageHeader({
  backPath,
  breadcrumbs,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  badges,
  rightInfo,
  actions
}: DetailPageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: backPath })
  }

  const handleBreadcrumbClick = (path?: string) => {
    if (path) {
      navigate({ to: path })
    }
  }

  return (
    <div className="space-y-6">
      {/* 네비게이션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로
          </Button>

          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                {crumb.path ? (
                  <button
                    onClick={() => handleBreadcrumbClick(crumb.path)}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-foreground font-medium">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* 액션 버튼들 - 데스크톱 */}
        {actions && (
          <div className="hidden md:flex items-center gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* 상품 정보 헤더 */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 좌측: 이미지 + 메인 정보 */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* 상품 이미지 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                    {title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                </div>

                {/* 뱃지들 */}
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge.variant}
                      className="text-xs"
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 추가 정보 */}
          {rightInfo && (
            <div className="hidden lg:block flex-shrink-0">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {rightInfo.label}
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {rightInfo.value}
                </div>
                {rightInfo.sublabel && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {rightInfo.sublabel}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 모바일 액션 버튼들 */}
        {actions && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="flex items-center gap-2"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 모바일 우측 정보 */}
        {rightInfo && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm">
              <span className="text-muted-foreground">{rightInfo.label}: </span>
              <span className="font-medium text-gray-900">{rightInfo.value}</span>
              {rightInfo.sublabel && (
                <span className="text-muted-foreground ml-2">({rightInfo.sublabel})</span>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}