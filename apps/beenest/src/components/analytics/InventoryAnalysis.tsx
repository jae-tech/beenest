import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  productName: string;
  currentStock: number;
  unitPrice: number;
  costPrice: number;
  soldQuantity: number; // 판매량 (분석용)
  category: string;
  supplier: string;
}

interface Transaction {
  id: string;
  type: 'PURCHASE' | 'SALE';
  productId?: string;
  quantity: number;
  totalAmount: number;
  status: string;
}

interface InventoryAnalysisProps {
  products: InventoryItem[];
  transactions: Transaction[];
  className?: string;
}

interface ABCAnalysisItem extends InventoryItem {
  revenue: number;
  turnoverRate: number;
  classification: 'A' | 'B' | 'C';
  stockValue: number;
}

const COLORS = {
  A: '#10b981', // green
  B: '#f59e0b', // yellow
  C: '#ef4444', // red
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-medium text-gray-900">
              {typeof entry.value === 'number'
                ? entry.dataKey === 'turnoverRate'
                  ? `${entry.value.toFixed(2)}회`
                  : formatCurrency(entry.value, { compact: true })
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const InventoryAnalysis = memo(({
  products,
  transactions,
  className = ""
}: InventoryAnalysisProps) => {
  // ABC 분석 데이터 계산
  const abcAnalysis = useMemo(() => {
    // 상품별 매출 및 회전율 계산
    const enrichedProducts: ABCAnalysisItem[] = products.map(product => {
      // 해당 상품의 판매 거래 찾기
      const salesTransactions = transactions.filter(
        t => t.type === 'SALE' &&
             t.productId === product.id &&
             t.status === 'COMPLETED'
      );

      // 매출 계산
      const revenue = salesTransactions.reduce(
        (sum, t) => sum + (t.totalAmount || 0), 0
      );

      // 판매량 계산
      const soldQuantity = salesTransactions.reduce(
        (sum, t) => sum + (t.quantity || 0), 0
      );

      // 재고 회전율 = 판매량 / 평균 재고
      // 간단화: 현재 재고를 평균 재고로 가정
      const turnoverRate = product.currentStock > 0
        ? soldQuantity / product.currentStock
        : 0;

      // 재고 가치
      const stockValue = product.currentStock * (product.costPrice || product.unitPrice);

      return {
        ...product,
        revenue,
        soldQuantity,
        turnoverRate,
        stockValue,
        classification: 'C' as 'A' | 'B' | 'C', // 임시로 C 설정
      };
    });

    // 매출 기준으로 정렬
    enrichedProducts.sort((a, b) => b.revenue - a.revenue);

    // ABC 분류 (파레토 80-20 법칙 기반)
    const totalRevenue = enrichedProducts.reduce((sum, p) => sum + p.revenue, 0);
    let cumulativeRevenue = 0;

    enrichedProducts.forEach(product => {
      cumulativeRevenue += product.revenue;
      const percentage = (cumulativeRevenue / totalRevenue) * 100;

      if (percentage <= 80) {
        product.classification = 'A';
      } else if (percentage <= 95) {
        product.classification = 'B';
      } else {
        product.classification = 'C';
      }
    });

    return enrichedProducts;
  }, [products, transactions]);

  // ABC 분류별 통계
  const abcStats = useMemo(() => {
    const stats = { A: [], B: [], C: [] } as Record<'A' | 'B' | 'C', ABCAnalysisItem[]>;

    abcAnalysis.forEach(item => {
      stats[item.classification].push(item);
    });

    return {
      A: {
        count: stats.A.length,
        revenue: stats.A.reduce((sum, item) => sum + item.revenue, 0),
        stockValue: stats.A.reduce((sum, item) => sum + item.stockValue, 0),
        avgTurnover: stats.A.length > 0
          ? stats.A.reduce((sum, item) => sum + item.turnoverRate, 0) / stats.A.length
          : 0,
      },
      B: {
        count: stats.B.length,
        revenue: stats.B.reduce((sum, item) => sum + item.revenue, 0),
        stockValue: stats.B.reduce((sum, item) => sum + item.stockValue, 0),
        avgTurnover: stats.B.length > 0
          ? stats.B.reduce((sum, item) => sum + item.turnoverRate, 0) / stats.B.length
          : 0,
      },
      C: {
        count: stats.C.length,
        revenue: stats.C.reduce((sum, item) => sum + item.revenue, 0),
        stockValue: stats.C.reduce((sum, item) => sum + item.stockValue, 0),
        avgTurnover: stats.C.length > 0
          ? stats.C.reduce((sum, item) => sum + item.turnoverRate, 0) / stats.C.length
          : 0,
      },
    };
  }, [abcAnalysis]);

  // 파이 차트 데이터
  const pieData = [
    { name: 'A급 상품', value: abcStats.A.count, color: COLORS.A },
    { name: 'B급 상품', value: abcStats.B.count, color: COLORS.B },
    { name: 'C급 상품', value: abcStats.C.count, color: COLORS.C },
  ];

  // 회전율 차트 데이터 (상위 10개)
  const topTurnoverProducts = abcAnalysis
    .filter(p => p.turnoverRate > 0)
    .sort((a, b) => b.turnoverRate - a.turnoverRate)
    .slice(0, 10);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">재고 분석</h2>
        <div className="text-sm text-gray-500">
          ABC 분석 및 재고 회전율
        </div>
      </div>

      {/* ABC 분석 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">A급</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">상품 수</span>
              <span className="font-semibold">{abcStats.A.count}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">매출 기여</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(abcStats.A.revenue, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">평균 회전율</span>
              <span className="font-semibold">{abcStats.A.avgTurnover.toFixed(2)}회</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">핵심 수익 상품</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-yellow-600">B급</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">상품 수</span>
              <span className="font-semibold">{abcStats.B.count}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">매출 기여</span>
              <span className="font-semibold text-yellow-600">
                {formatCurrency(abcStats.B.revenue, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">평균 회전율</span>
              <span className="font-semibold">{abcStats.B.avgTurnover.toFixed(2)}회</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">중간 수익 상품</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-red-600">C급</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">상품 수</span>
              <span className="font-semibold">{abcStats.C.count}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">매출 기여</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(abcStats.C.revenue, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">평균 회전율</span>
              <span className="font-semibold">{abcStats.C.avgTurnover.toFixed(2)}회</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">개선 필요 상품</p>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ABC 분포 파이 차트 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ABC 분류 분포</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value}개 (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 재고 회전율 차트 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 재고 회전율</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTurnoverProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="productName"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="turnoverRate"
                  fill="#3b82f6"
                  name="회전율"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 재고 분석 인사이트 */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">재고 분석 인사이트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              회전율 개선 포인트
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <TrendingDown className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>C급 상품 {abcStats.C.count}개의 재고 최적화 필요</span>
              </li>
              <li className="flex items-start space-x-2">
                <Package className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>높은 회전율 상품의 재고 확보 고려</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>저회전 상품의 마케팅 전략 필요</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              권장 액션
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>A급 상품 재고 수준 유지 및 확대</span>
              </li>
              <li className="flex items-start space-x-2">
                <RotateCcw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>B급 상품 프로모션을 통한 회전율 향상</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>C급 상품 재고 감소 또는 단종 검토</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
});