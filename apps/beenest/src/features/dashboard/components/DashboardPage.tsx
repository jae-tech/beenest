import {
  Calendar,
  Edit,
  ExternalLink,
  Flag,
  Image,
  MapPin,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { MetricsGrid } from "./MetricsGrid";
import { RevenueChart } from "./RevenueChart";

interface DashboardPageProps {
  className?: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="text-center py-12">
    <div className="text-red-600 text-lg mb-4">{error}</div>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      다시 시도
    </button>
  </div>
);

const RecentOrdersTable = ({ orders }: { orders: any[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
            상품 정보
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
            주문 번호
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
            가격
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
            배송 상태
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
            관리
          </th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            name: "백팩",
            sku: "25개 재고 있음",
            orderId: "#ORD100",
            price: "₩200,000",
            status: "완료",
            statusColor: "bg-green-100 text-green-800",
          },
          {
            name: "티셔츠",
            sku: "25개 재고 있음",
            orderId: "#ORD200",
            price: "₩89,000",
            status: "진행중",
            statusColor: "bg-yellow-100 text-yellow-800",
          },
          {
            name: "선글라스",
            sku: "15개 재고 있음",
            orderId: "#ORD300",
            price: "₩150,000",
            status: "대기중",
            statusColor: "bg-gray-100 text-gray-800",
          },
        ].map((item, index) => (
          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Image className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.sku}</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4 text-sm text-gray-900">{item.orderId}</td>
            <td className="py-4 px-4 text-sm font-medium text-gray-900">
              {item.price}
            </td>
            <td className="py-4 px-4">
              <span
                className={`${item.statusColor} text-xs font-medium px-2 py-1 rounded-full`}
              >
                {item.status}
              </span>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center space-x-2">
                <button className="border border-gray-200 p-1 rounded cursor-pointer hover:bg-gray-50">
                  <Edit className="w-3 h-3 text-gray-600" />
                </button>
                <button className="border border-gray-200 p-1 rounded cursor-pointer hover:bg-gray-50">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DashboardPage = ({ className = "" }: DashboardPageProps) => {
  const {
    metrics,
    salesData,
    newStock,
    monthlyRevenue,
    isLoading,
    error,
    refreshMetrics,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">비즈니스 현황을 한눈에 확인하세요</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        </div>
        <ErrorState error={error} onRetry={refreshMetrics} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 bg-gray-50 min-h-screen ${className}`}>
      {/* Metrics Cards */}
      <MetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">지역별 매출</h3>
          </div>
          <div className="relative h-48 bg-gray-900 rounded-lg overflow-hidden mb-4">
            <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">대한민국</span>
              </div>
              <p className="text-xs text-gray-600">₩15,420,000 매출</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">대한민국</span>
              </div>
              <span className="text-sm font-semibold">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "90%" }}
              ></div>
            </div>
          </div>
          <button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white !rounded-button whitespace-nowrap cursor-pointer py-2 px-4 font-semibold">
            전체 보기
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              판매 및 주문
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  placeholder="상품 검색..."
                  className="pl-8 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-md focus:border-yellow-400 focus:ring-yellow-400"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                <Calendar className="w-4 h-4 mr-2 inline" />
                월별
              </button>
            </div>
          </div>
          <RecentOrdersTable orders={salesData} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                베스트셀러 상품
              </h3>
              <button className="border border-gray-200 p-1 rounded cursor-pointer">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              신규 입고 상품
            </h3>
            <div className="space-y-4">
              {(newStock || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.sku}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.qty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
