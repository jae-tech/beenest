import { memo, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { TooltipPayload } from "@/types/api";

interface ChartData {
  month: string;
  purchases: number;
  sales: number;
  profit: number;
  profitMargin: number;
}

interface PurchaseSaleChartProps {
  data: ChartData[];
  className?: string;
  height?: number;
}

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipPayload) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`${label}`}</p>
        {payload.map((entry: TooltipEntry, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-medium text-gray-900">
              {entry.dataKey === 'profitMargin'
                ? `${entry.value.toFixed(1)}%`
                : formatCurrency(entry.value, { compact: true })
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PurchaseSaleChart = memo(({
  data,
  className = "",
  height = 400,
}: PurchaseSaleChartProps) => {
  // 총 통계 계산
  const totals = useMemo(() => {
    const totalPurchases = data.reduce((sum, item) => sum + item.purchases, 0);
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const avgProfitMargin = data.length > 0
      ? data.reduce((sum, item) => sum + item.profitMargin, 0) / data.length
      : 0;

    return {
      totalPurchases,
      totalSales,
      totalProfit,
      avgProfitMargin,
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          매입/매출 분석
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          매입/매출 분석
        </h3>

        {/* 요약 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">총 매입액</p>
            <p className="text-xl font-bold text-blue-900">
              {formatCurrency(totals.totalPurchases, { compact: true })}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">총 매출액</p>
            <p className="text-xl font-bold text-green-900">
              {formatCurrency(totals.totalSales, { compact: true })}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">총 이익</p>
            <p className="text-xl font-bold text-purple-900">
              {formatCurrency(totals.totalProfit, { compact: true })}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">평균 이익률</p>
            <p className="text-xl font-bold text-yellow-900">
              {totals.avgProfitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div style={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              yAxisId="amount"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={(value) => `₩${(value / 1000000).toFixed(0)}M`}
            />
            <YAxis
              yAxisId="percentage"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e0e0e0" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* 매입 바 차트 */}
            <Bar
              yAxisId="amount"
              dataKey="purchases"
              name="매입액"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />

            {/* 매출 바 차트 */}
            <Bar
              yAxisId="amount"
              dataKey="sales"
              name="매출액"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />

            {/* 이익률 라인 차트 */}
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="profitMargin"
              name="이익률"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#f59e0b" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 설명 */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">매입액</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">매출액</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">이익률</span>
        </div>
      </div>
    </div>
  );
});