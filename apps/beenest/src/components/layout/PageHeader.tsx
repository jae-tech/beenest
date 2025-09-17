import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type PageHeaderProps = {
  title: string;
  actionText: string;
  onAction?: () => void;
};

export function PageHeader({ title, actionText, onAction }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <Button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer"
        onClick={onAction}
      >
        <Plus className="h-4 w-4 mr-2" />
        {actionText}
      </Button>
    </div>
  );
}