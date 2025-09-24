import { InventoryAnalysis } from "@/components/analytics/InventoryAnalysis";
import { ProfitabilityMetrics } from "@/components/analytics/ProfitabilityMetrics";
import { SupplierPerformance } from "@/components/analytics/SupplierPerformance";
import { PurchaseSaleChart } from "@/components/charts/PurchaseSaleChart";
import { PageLayout } from "@/components/layout";
import {
  useDemoProducts,
  useDemoSuppliers,
  useDemoTransactionStats,
  useDemoTransactions,
} from "@/hooks/useDemoData";
import { useMemo } from "react";

export function AnalyticsPage() {
  const { stats } = useDemoTransactionStats();
  const { transactions } = useDemoTransactions();
  const { products } = useDemoProducts();
  const { suppliers } = useDemoSuppliers();

  // 월별 매입/매출 데이터 생성
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // 최근 6개월 데이터 생성
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      });

      // 해당 월의 거래 필터링
      const monthTransactions = transactions.filter((t) => {
        const txnDate = new Date(t.transactionDate);
        const txnMonthKey = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, "0")}`;
        return txnMonthKey === monthKey && t.status === "COMPLETED";
      });

      // 매입/매출 계산
      const purchases = monthTransactions
        .filter((t) => t.type === "PURCHASE")
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

      const sales = monthTransactions
        .filter((t) => t.type === "SALE")
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

      const profit = sales - purchases;
      const profitMargin = sales > 0 ? (profit / sales) * 100 : 0;

      months.push({
        month: monthName,
        purchases,
        sales,
        profit,
        profitMargin,
      });
    }

    return months;
  }, [transactions]);

  // 수익성 데이터 준비
  const profitabilityData = useMemo(
    () => ({
      totalSales: stats.totalSales,
      totalPurchases: stats.totalPurchases,
      totalProfit: stats.totalProfit,
      profitMargin: stats.profitMargin,
      monthlyGrowthRate: stats.monthlyGrowthRate,
      previousMonthSales: stats.thisMonthSales * 0.85, // 데모용 이전달 데이터
      previousMonthPurchases: stats.thisMonthPurchases * 0.9,
    }),
    [stats]
  );

  return (
    <PageLayout
      title="비즈니스 분석"
      subtitle="매입/매출 분석 및 수익성 지표를 확인하세요"
    >
      <div className="space-y-8">
        {/* 수익성 지표 */}
        <ProfitabilityMetrics data={profitabilityData} />

        {/* 매입/매출 차트 */}
        <PurchaseSaleChart data={chartData} />

        {/* 재고 분석 */}
        <InventoryAnalysis products={products} transactions={transactions} />

        {/* 거래처 성과 평가 */}
        <SupplierPerformance
          suppliers={suppliers}
          transactions={transactions}
        />

        {/* 추가 분석 카드들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 거래 현황 요약 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              거래 현황 요약
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">총 거래 건수</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalTransactions}건
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">대기 중인 거래</span>
                <span className="font-semibold text-orange-600">
                  {stats.pendingTransactions}건
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">이번 달 매출</span>
                <span className="font-semibold text-green-600">
                  {stats.thisMonthSales.toLocaleString("ko-KR")}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">이번 달 매입</span>
                <span className="font-semibold text-blue-600">
                  {stats.thisMonthPurchases.toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>
          </div>

          {/* 성과 지표 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              주요 성과 지표
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">총 이익</span>
                  <span className="text-xl font-bold text-green-900">
                    {stats.totalProfit.toLocaleString("ko-KR")}원
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">전체 거래 이익</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-medium">평균 이익률</span>
                  <span className="text-xl font-bold text-blue-900">
                    {stats.profitMargin.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  매출 대비 이익 비율
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-medium">
                    월별 성장률
                  </span>
                  <span className="text-xl font-bold text-purple-900">
                    {stats.monthlyGrowthRate.toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-purple-600 mt-1">전월 대비 성장</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
