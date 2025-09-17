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
    <div className="p-6 space-y-6 bg-gray-50">
      <PageHeader title={title} actionText={actionText} onAction={onAction} />

      <StatsGrid stats={stats} />

      <Card className="p-6">
        <SearchFilter
          showExport={showExport}
          onFilter={onFilter}
          onExport={onExport}
        />
        {children}
      </Card>
    </div>
  );
}