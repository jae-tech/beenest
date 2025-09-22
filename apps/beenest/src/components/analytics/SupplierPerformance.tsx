import { memo, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Supplier {
  id: string;
  supplierName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Transaction {
  id: string;
  supplierId?: string;
  supplierName?: string;
  totalAmount: number;
  quantity: number;
  status: string;
  transactionDate: string;
  type: 'PURCHASE' | 'SALE';
}

interface SupplierPerformanceProps {
  suppliers: Supplier[];
  transactions: Transaction[];
  className?: string;
}

interface SupplierMetrics {
  id: string;
  name: string;
  totalPurchases: number;
  totalOrders: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  priceCompetitiveness: number;
  responsiveness: number;
  overallScore: number;
  status: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
  lastOrderDate: string;
  performanceChange: number; // 전월 대비 변화율
}

const PERFORMANCE_COLORS = {
  EXCELLENT: '#10b981',
  GOOD: '#3b82f6',
  AVERAGE: '#f59e0b',
  NEEDS_IMPROVEMENT: '#ef4444',
};

interface RadarTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: RadarTooltipProps) => {
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
              {entry.dataKey === 'totalPurchases'
                ? formatCurrency(entry.value, { compact: true })
                : entry.dataKey === 'overallScore'
                  ? `${entry.value.toFixed(1)}점`
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

export const SupplierPerformance = memo(({
  suppliers,
  transactions,
  className = ""
}: SupplierPerformanceProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT'>('ALL');

  // 공급업체별 성과 지표 계산
  const supplierMetrics = useMemo<SupplierMetrics[]>(() => {
    return suppliers.map(supplier => {
      // 해당 공급업체의 매입 거래 필터링
      const supplierTransactions = transactions.filter(
        t => t.type === 'PURCHASE' &&
             (t.supplierId === supplier.id || t.supplierName === supplier.supplierName) &&
             t.status === 'COMPLETED'
      );

      // 기본 지표 계산
      const totalPurchases = supplierTransactions.reduce(
        (sum, t) => sum + t.totalAmount, 0
      );
      const totalOrders = supplierTransactions.length;
      const averageOrderValue = totalOrders > 0 ? totalPurchases / totalOrders : 0;

      // 성과 지표 계산 (데모용 로직)
      const onTimeDeliveryRate = 85 + Math.random() * 15; // 85-100%
      const qualityScore = 7 + Math.random() * 3; // 7-10점
      const priceCompetitiveness = 6 + Math.random() * 4; // 6-10점
      const responsiveness = 7 + Math.random() * 3; // 7-10점

      // 종합 점수 계산 (가중 평균)
      const overallScore = (
        onTimeDeliveryRate * 0.3 +
        qualityScore * 10 * 0.25 +
        priceCompetitiveness * 10 * 0.25 +
        responsiveness * 10 * 0.2
      );

      // 성과 등급 결정
      let status: SupplierMetrics['status'];
      if (overallScore >= 90) status = 'EXCELLENT';
      else if (overallScore >= 80) status = 'GOOD';
      else if (overallScore >= 70) status = 'AVERAGE';
      else status = 'NEEDS_IMPROVEMENT';

      // 마지막 주문일
      const lastOrderDate = supplierTransactions.length > 0
        ? supplierTransactions
            .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0]
            .transactionDate
        : '';

      // 성과 변화율 (데모용)
      const performanceChange = -5 + Math.random() * 20; // -5% ~ +15%

      return {
        id: supplier.id,
        name: supplier.supplierName,
        totalPurchases,
        totalOrders,
        averageOrderValue,
        onTimeDeliveryRate,
        qualityScore,
        priceCompetitiveness,
        responsiveness,
        overallScore,
        status,
        lastOrderDate,
        performanceChange,
      };
    });
  }, [suppliers, transactions]);

  // 필터링된 공급업체
  const filteredMetrics = supplierMetrics.filter(
    metric => filterStatus === 'ALL' || metric.status === filterStatus
  );

  // 상위 공급업체 (종합 점수 기준)
  const topSuppliers = [...supplierMetrics]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  // 선택된 공급업체의 레이더 차트 데이터
  const selectedSupplierData = selectedSupplier
    ? supplierMetrics.find(m => m.id === selectedSupplier)
    : null;

  const radarData = selectedSupplierData ? [
    {
      metric: '정시배송',
      value: selectedSupplierData.onTimeDeliveryRate,
      fullMark: 100,
    },
    {
      metric: '품질',
      value: selectedSupplierData.qualityScore * 10,
      fullMark: 100,
    },
    {
      metric: '가격경쟁력',
      value: selectedSupplierData.priceCompetitiveness * 10,
      fullMark: 100,
    },
    {
      metric: '응답성',
      value: selectedSupplierData.responsiveness * 10,
      fullMark: 100,
    },
  ] : [];

  // 성과 등급별 통계
  const statusStats = useMemo(() => {
    const stats = { EXCELLENT: 0, GOOD: 0, AVERAGE: 0, NEEDS_IMPROVEMENT: 0 };
    supplierMetrics.forEach(metric => {
      stats[metric.status]++;
    });
    return stats;
  }, [supplierMetrics]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">공급업체 성과 평가</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="ALL">전체</option>
              <option value="EXCELLENT">우수</option>
              <option value="GOOD">양호</option>
              <option value="AVERAGE">보통</option>
              <option value="NEEDS_IMPROVEMENT">개선필요</option>
            </select>
          </div>
        </div>
      </div>

      {/* 성과 등급 요약 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">우수</p>
              <p className="text-2xl font-bold text-green-600">{statusStats.EXCELLENT}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">양호</p>
              <p className="text-2xl font-bold text-blue-600">{statusStats.GOOD}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">보통</p>
              <p className="text-2xl font-bold text-yellow-600">{statusStats.AVERAGE}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">개선필요</p>
              <p className="text-2xl font-bold text-red-600">{statusStats.NEEDS_IMPROVEMENT}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 상위 공급업체 차트 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 공급업체 순위</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSuppliers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="overallScore"
                  fill="#3b82f6"
                  name="종합점수"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 공급업체 상세 분석 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">공급업체 상세 분석</h3>
          <div className="mb-4">
            <select
              value={selectedSupplier || ''}
              onChange={(e) => setSelectedSupplier(e.target.value || null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">공급업체를 선택하세요</option>
              {supplierMetrics.map(metric => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
          </div>
          {selectedSupplierData ? (
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                  />
                  <Radar
                    name="성과지표"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              공급업체를 선택해주세요
            </div>
          )}
        </Card>
      </div>

      {/* 공급업체 목록 테이블 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">공급업체 성과 목록</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">공급업체</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">종합점수</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">총 매입액</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">주문 수</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">정시배송률</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">등급</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((metric) => (
                <tr key={metric.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <p className="text-sm text-gray-500">
                        마지막 주문: {metric.lastOrderDate ?
                          new Date(metric.lastOrderDate).toLocaleDateString('ko-KR') :
                          '없음'
                        }
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{metric.overallScore.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(metric.overallScore / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {formatCurrency(metric.totalPurchases, { compact: true })}
                  </td>
                  <td className="py-4 px-4">{metric.totalOrders}건</td>
                  <td className="py-4 px-4">{metric.onTimeDeliveryRate.toFixed(1)}%</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white`}
                      style={{ backgroundColor: PERFORMANCE_COLORS[metric.status] }}
                    >
                      {metric.status === 'EXCELLENT' ? '우수' :
                       metric.status === 'GOOD' ? '양호' :
                       metric.status === 'AVERAGE' ? '보통' : '개선필요'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSupplier(metric.id)}
                    >
                      상세보기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 개선 권장사항 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">공급업체 관리 권장사항</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              우수 공급업체 관리
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>우수 공급업체와의 장기 계약 검토</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>우선 공급업체로 더 많은 주문 할당</span>
              </li>
              <li className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>볼륨 할인 협상 기회 모색</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              개선 필요 공급업체
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>배송 지연 문제 해결 요청</span>
              </li>
              <li className="flex items-start space-x-2">
                <Package className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>품질 개선 계획 수립 및 모니터링</span>
              </li>
              <li className="flex items-start space-x-2">
                <Users className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>대체 공급업체 검토 및 리스크 관리</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
});