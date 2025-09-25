import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type StatItem = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: "blue" | "green" | "yellow" | "purple" | "red";
};

type StatsGridProps = {
  stats: StatItem[];
};

const colorMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card text-center bg-white rounded-xl shadow-md p-6">
          <div
            className={`w-12 h-12 ${colorMap[stat.color]} rounded-xl flex items-center justify-center mx-auto mb-3`}
          >
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
            {stat.value}
          </p>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}