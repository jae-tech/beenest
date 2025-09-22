import { memo, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ProfitabilityData {
  totalSales: number;
  totalPurchases: number;
  totalProfit: number;
  profitMargin: number;
  monthlyGrowthRate: number;
  previousMonthSales?: number;
  previousMonthPurchases?: number;
}

interface ProfitabilityMetricsProps {
  data: ProfitabilityData;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

const MetricCard = memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  description
}: MetricCardProps) => {
  const changeIcon = changeType === 'increase' ? ArrowUpRight :
                    changeType === 'decrease' ? ArrowDownRight : null;

  const changeColor = changeType === 'increase' ? 'text-green-600' :
                     changeType === 'decrease' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && changeIcon && (
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <changeIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </Card>
  );
});

export const ProfitabilityMetrics = memo(({
  data,
  className = ""
}: ProfitabilityMetricsProps) => {
  // 지표 계산
  const metrics = useMemo(() => {
    const {
      totalSales,
      totalPurchases,
      totalProfit,
      profitMargin,
      monthlyGrowthRate,
      previousMonthSales = 0,
    } = data;

    // ROI (Return on Investment) 계산
    const roi = totalPurchases > 0 ? ((totalProfit / totalPurchases) * 100) : 0;

    // 매출 성장률
    const salesGrowthRate = previousMonthSales > 0
      ? ((totalSales - previousMonthSales) / previousMonthSales) * 100
      : monthlyGrowthRate;

    // 비용 대비 수익률
    const revenuePerCost = totalPurchases > 0 ? totalSales / totalPurchases : 0;

    // 평균 거래 이익률
    const avgTransactionMargin = profitMargin;

    return [
      {
        title: "총 이익",
        value: formatCurrency(totalProfit, { compact: true }),
        change: totalProfit > 0 ? `+${formatCurrency(totalProfit * 0.1, { compact: true })}` : undefined,
        changeType: totalProfit > 0 ? 'increase' as const : 'neutral' as const,
        icon: DollarSign,
        color: "bg-green-500",
        description: "총 매출액 - 총 매입액",
      },
      {
        title: "이익률",
        value: `${profitMargin.toFixed(1)}%`,
        change: profitMargin > 20 ? "우수" : profitMargin > 10 ? "보통" : "개선 필요",
        changeType: profitMargin > 20 ? 'increase' as const :
                   profitMargin > 10 ? 'neutral' as const : 'decrease' as const,
        icon: Percent,
        color: "bg-blue-500",
        description: "매출 대비 이익 비율",
      },
      {
        title: "투자 수익률 (ROI)",
        value: `${roi.toFixed(1)}%`,
        change: roi > 50 ? "우수" : roi > 25 ? "보통" : "개선 필요",
        changeType: roi > 50 ? 'increase' as const :
                   roi > 25 ? 'neutral' as const : 'decrease' as const,
        icon: Target,
        color: "bg-purple-500",
        description: "투자 대비 수익률",
      },
      {
        title: "매출 성장률",
        value: `${salesGrowthRate.toFixed(1)}%`,
        change: salesGrowthRate > 0 ? `+${salesGrowthRate.toFixed(1)}%` : `${salesGrowthRate.toFixed(1)}%`,
        changeType: salesGrowthRate > 0 ? 'increase' as const : 'decrease' as const,
        icon: TrendingUp,
        color: "bg-indigo-500",
        description: "전월 대비 성장률",
      },
      {
        title: "비용 대비 수익",
        value: `${revenuePerCost.toFixed(2)}x`,
        change: revenuePerCost > 2 ? "우수" : revenuePerCost > 1.5 ? "보통" : "개선 필요",
        changeType: revenuePerCost > 2 ? 'increase' as const :
                   revenuePerCost > 1.5 ? 'neutral' as const : 'decrease' as const,
        icon: BarChart3,
        color: "bg-orange-500",
        description: "₩1 투자당 수익",
      },
      {
        title: "평균 거래 마진",
        value: `${avgTransactionMargin.toFixed(1)}%`,
        change: avgTransactionMargin > 25 ? "우수" : avgTransactionMargin > 15 ? "보통" : "개선 필요",
        changeType: avgTransactionMargin > 25 ? 'increase' as const :
                   avgTransactionMargin > 15 ? 'neutral' as const : 'decrease' as const,
        icon: TrendingUp,
        color: "bg-teal-500",
        description: "거래당 평균 이익률",
      },
    ];
  }, [data]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">수익성 지표</h2>
        <div className="text-sm text-gray-500">
          실시간 업데이트
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            color={metric.color}
            description={metric.description}
          />
        ))}
      </div>

      {/* 수익성 분석 요약 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">수익성 분석 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">강점</h4>
            <ul className="space-y-1 text-gray-600">
              {data.profitMargin > 15 && (
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>우수한 이익률 유지</span>
                </li>
              )}
              {data.monthlyGrowthRate > 10 && (
                <li className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>높은 성장률</span>
                </li>
              )}
              {data.totalProfit > 1000000 && (
                <li className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>안정적인 수익 구조</span>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">개선 포인트</h4>
            <ul className="space-y-1 text-gray-600">
              {data.profitMargin < 10 && (
                <li className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-orange-500" />
                  <span>이익률 개선 필요</span>
                </li>
              )}
              {data.monthlyGrowthRate < 5 && (
                <li className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-orange-500" />
                  <span>성장률 향상 필요</span>
                </li>
              )}
              {(data.totalSales / data.totalPurchases) < 1.5 && (
                <li className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span>비용 효율성 개선</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
});