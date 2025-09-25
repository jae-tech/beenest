import { Card } from "@/components/ui/card";
import { PageHeader } from "./PageHeader";
import { StatsGrid } from "./StatsGrid";
import { SearchFilter } from "./SearchFilter";
import { type PageLayoutProps } from "@/types/design-system";

export function PageLayout({
  title,
  actionText,
  stats,
  children,
  onAction,
  showExport = false,
  onFilter,
  onExport,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 space-y-6">
        <PageHeader title={title} actionText={actionText} onAction={onAction} />

        {stats && <StatsGrid stats={stats} />}

        {/* 메인 콘텐츠 컨테이너 - 검색/필터 + 데이터 테이블 통합 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SearchFilter
            showExport={showExport}
            onFilter={onFilter}
            onExport={onExport}
          />
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}