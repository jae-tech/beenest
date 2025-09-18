import { MetricCard } from "@/components/ui/metric-card/MetricCard";
import type { DashboardMetric } from "../hooks/useDashboard";

interface MetricsGridProps {
  metrics: DashboardMetric[];
  className?: string;
}

export const MetricsGrid = ({ metrics, className = "" }: MetricsGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className}`}
    >
      {(metrics || []).map((metric, index) => (
        <MetricCard
          key={index}
          icon={metric.icon}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          color={metric.color}
        />
      ))}
    </div>
  );
};
