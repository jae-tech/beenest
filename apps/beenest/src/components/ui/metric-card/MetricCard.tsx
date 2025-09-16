import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  color: string;
  trend: "up" | "down";
}

export const MetricCard = ({
  icon: IconComponent,
  title,
  value,
  change,
  color,
  trend,
}: MetricCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400" />
    </div>
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center space-x-2">
        <span
          className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {change}
        </span>
        <span className="text-xs text-gray-500">Since last month</span>
      </div>
    </div>
  </Card>
);
