import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";

type SearchFilterProps = {
  showExport?: boolean;
  onFilter?: () => void;
  onExport?: () => void;
};

export function SearchFilter({
  showExport = false,
  onFilter,
  onExport,
}: SearchFilterProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="cursor-pointer whitespace-nowrap" onClick={onFilter}>
          <Filter className="h-4 w-4 mr-2" />
          필터
        </Button>
      </div>
      {showExport && (
        <Button variant="outline" className="cursor-pointer whitespace-nowrap" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          내보내기
        </Button>
      )}
    </div>
  );
}