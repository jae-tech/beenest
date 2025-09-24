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
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-8 space-y-8">
        <PageHeader title={title} actionText={actionText} onAction={onAction} />

        {stats && <StatsGrid stats={stats} />}

        <Card className="overflow-hidden">
          <SearchFilter
            showExport={showExport}
            onFilter={onFilter}
            onExport={onExport}
          />
          <div className="px-0">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}