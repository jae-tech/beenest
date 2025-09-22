import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactions, useTransactionStats } from "@/hooks/useTransactions";
import { TransactionType, TransactionStatus, GetTransactionsParams } from "@beenest/types";
import { useState, useMemo } from "react";
import TransactionModal from "./TransactionModal";

// 필터링 상태 타입
interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
  supplier: string;
  product: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
}

const TransactionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeTab, setActiveTab] = useState("all");

  // 필터링 상태
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    startDate: "",
    endDate: "",
    supplier: "",
    product: "",
  });

  // API 쿼리 파라미터 생성
  const queryParams = useMemo<GetTransactionsParams>(() => ({
    page: 1,
    limit: 50,
    search: filters.search || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    transactionType: filters.transactionType,
    status: filters.status,
  }), [filters]);

  // 탭에 따른 필터 적용
  const tabQueryParams = useMemo<GetTransactionsParams>(() => {
    switch (activeTab) {
      case "sale":
        return { ...queryParams, transactionType: TransactionType.SALE };
      case "purchase":
        return { ...queryParams, transactionType: TransactionType.PURCHASE };
      case "pending":
        return { ...queryParams, status: TransactionStatus.PENDING };
      default:
        return queryParams;
    }
  }, [activeTab, queryParams]);

  // API 호출
  const { data: transactionsData, isLoading, error } = useTransactions(tabQueryParams);
  const { data: statsData, isLoading: statsLoading } = useTransactionStats();

  // 거래 목록
  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;

  // 임시 목업 데이터 (백엔드 연결 전까지 사용)
  const mockTransactions = [
    {
      id: "1",
      transactionNumber: "SAL-20241201-001",
      date: "2024-12-01",
      customerName: "홍길동 고객",
      productName: "프리미엄 원두커피 1kg",
      quantity: 10,
      unitPrice: 125000,
      totalAmount: 1250000,
      type: "SALE",
      status: "CONFIRMED",
    },
    {
      id: "2",
      transactionNumber: "PUR-20241130-002",
      date: "2024-11-30",
      supplierName: "㈜한국자재",
      productName: "스테인리스 보온병 500ml",
      quantity: 50,
      unitPrice: 17800,
      totalAmount: 890000,
      type: "PURCHASE",
      status: "CONFIRMED",
    },
    {
      id: "3",
      transactionNumber: "SAL-20241129-003",
      date: "2024-11-29",
      customerName: "ABC마트",
      productName: "유기농 녹차 티백 100개입",
      quantity: 100,
      unitPrice: 21000,
      totalAmount: 2100000,
      type: "SALE",
      status: "PENDING",
    },
    {
      id: "4",
      transactionNumber: "PUR-20241128-004",
      date: "2024-11-28",
      supplierName: "대한장비㈜",
      productName: "커피 그라인딩 머신",
      quantity: 1,
      unitPrice: 5450000,
      totalAmount: 5450000,
      type: "PURCHASE",
      status: "CONFIRMED",
    },
    {
      id: "5",
      transactionNumber: "SAL-20241127-005",
      date: "2024-11-27",
      customerName: "이영희 고객",
      productName: "디카페인 원두커피 500g",
      quantity: 8,
      unitPrice: 40000,
      totalAmount: 320000,
      type: "SALE",
      status: "CONFIRMED",
    },
  ];

  // 통계 데이터 (API 우선, 로딩 중에는 기본값)
  const stats = statsData || {
    totalSales: 0,
    totalPurchases: 0,
    totalProfit: 0,
    profitMargin: 0,
    thisMonthSales: 0,
    thisMonthPurchases: 0,
  };

  // 필터 핸들러
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 검색 핸들러
  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString('ko-KR')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "확정";
      case "PENDING":
        return "대기";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

  const getTransactionTypeText = (type: string) => {
    return type === "SALE" ? "매출" : "매입";
  };

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (transactionData: any) => {
    console.log("저장할 거래 데이터:", transactionData);
    // 실제로는 API 호출로 저장 처리
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            매입/매출 관리
          </h1>
          <p className="text-gray-600 mt-2">
            언제, 누구와, 무엇을, 얼마나, 얼마에 거래했는지 한눈에 확인하세요
          </p>
        </div>
        <Button
          onClick={handleCreateTransaction}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 !rounded-button whitespace-nowrap cursor-pointer text-lg"
        >
          <i className="fas fa-plus mr-3 text-lg"></i>
          새 거래 등록
        </Button>
      </div>

      {/* 분석 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-chart-line text-2xl text-white"></i>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statsLoading ? "..." : formatCurrency(stats.totalProfit)}
          </p>
          <p className="text-base font-medium text-gray-600">매출 총이익</p>
          <p className="text-sm text-gray-400 mt-2">총매출액 - 총매입액</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-arrow-up text-2xl text-white"></i>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statsLoading ? "..." : formatCurrency(stats.thisMonthSales)}
          </p>
          <p className="text-base font-medium text-gray-600">이번 달 매출액</p>
          <p className="text-sm text-gray-400 mt-2">{new Date().getMonth() + 1}월 매출 합계</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-arrow-down text-2xl text-white"></i>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statsLoading ? "..." : formatCurrency(stats.thisMonthPurchases)}
          </p>
          <p className="text-base font-medium text-gray-600">이번 달 매입액</p>
          <p className="text-sm text-gray-400 mt-2">{new Date().getMonth() + 1}월 매입 합계</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-percentage text-2xl text-white"></i>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statsLoading ? "..." : `${stats.profitMargin.toFixed(1)}%`}
          </p>
          <p className="text-base font-medium text-gray-600">수익률</p>
          <p className="text-sm text-gray-400 mt-2">(총이익/총매출) × 100</p>
        </Card>
      </div>

      {/* 거래 목록 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-4">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  전체 거래
                </TabsTrigger>
                <TabsTrigger value="sale" onClick={() => setActiveTab("sale")}>
                  매출
                </TabsTrigger>
                <TabsTrigger value="purchase" onClick={() => setActiveTab("purchase")}>
                  매입
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setActiveTab("pending")}>
                  대기중
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {/* 기간별 필터 */}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="date"
                      className="w-40 text-sm"
                      placeholder="시작일"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <span className="text-gray-400">~</span>
                    <Input
                      type="date"
                      className="w-40 text-sm"
                      placeholder="종료일"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>

                  {/* 거래처별 필터 */}
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={filters.supplier}
                    onChange={(e) => handleFilterChange('supplier', e.target.value)}
                  >
                    <option value="">전체 거래처</option>
                    <option value="카페 온더코너">카페 온더코너</option>
                    <option value="청년 창업 카페">청년 창업 카페</option>
                    <option value="스마트오피스">스마트오피스</option>
                    <option value="테크노 일렉트로닉스">테크노 일렉트로닉스</option>
                    <option value="패션플러스">패션플러스</option>
                  </select>

                  {/* 품목별 필터 */}
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={filters.product}
                    onChange={(e) => handleFilterChange('product', e.target.value)}
                  >
                    <option value="">전체 품목</option>
                    <option value="헤드폰">헤드폰</option>
                    <option value="티셔츠">티셔츠</option>
                    <option value="스피커">스피커</option>
                    <option value="백팩">백팩</option>
                    <option value="러닝화">러닝화</option>
                  </select>
                </div>

                <div className="relative">
                  <Input
                    placeholder="거래처명, 품목명 검색..."
                    className="pl-10 pr-4 py-2 w-80 text-sm"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        거래일자
                        <span className="text-xs text-gray-400 block font-normal">언제</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        거래처
                        <span className="text-xs text-gray-400 block font-normal">누구와</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        품목
                        <span className="text-xs text-gray-400 block font-normal">무엇을</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        수량
                        <span className="text-xs text-gray-400 block font-normal">얼마나</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        단가/합계
                        <span className="text-xs text-gray-400 block font-normal">얼마에</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        거래유형
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        상태
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                            <span className="ml-2">데이터를 불러오는 중...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-red-500">
                          데이터를 불러오는데 실패했습니다.
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          거래 데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {/* 거래일자 - 언제 */}
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(transaction.transactionDate).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {transaction.transactionNumber}
                          </div>
                        </td>

                        {/* 거래처 - 누구와 */}
                        <td className="py-4 px-4">
                          <Badge className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                            {transaction.supplier?.companyName || transaction.customerName || "정보 없음"}
                          </Badge>
                        </td>

                        {/* 품목 - 무엇을 */}
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.items?.[0]?.product?.productName || "정보 없음"}
                            {transaction.items && transaction.items.length > 1 && (
                              <span className="text-xs text-gray-500 ml-1">
                                외 {transaction.items.length - 1}건
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 수량 - 얼마나 */}
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}개
                          </div>
                        </td>

                        {/* 단가/합계 - 얼마에 */}
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {transaction.items?.[0] && (
                              <>단가: {formatCurrency(Number(transaction.items[0].unitPrice))}</>
                            )}
                          </div>
                          <div className="text-sm font-bold">
                            <span
                              className={
                                transaction.transactionType === TransactionType.SALE
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {transaction.transactionType === TransactionType.SALE ? "+" : "-"}
                              {formatCurrency(Number(transaction.totalAmount))}
                            </span>
                          </div>
                        </td>

                        {/* 거래유형 */}
                        <td className="py-4 px-4">
                          <Badge
                            className={`${
                              transaction.transactionType === TransactionType.SALE
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            } text-xs font-medium px-2 py-1 rounded-full`}
                          >
                            {getTransactionTypeText(transaction.transactionType)}
                          </Badge>
                        </td>

                        {/* 상태 */}
                        <td className="py-4 px-4">
                          <Badge
                            className={`${getStatusColor(transaction.status)} text-xs font-medium px-2 py-1 rounded-full`}
                          >
                            {getStatusText(transaction.status)}
                          </Badge>
                        </td>

                        {/* 작업 */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                              title="상세보기"
                            >
                              <i className="fas fa-eye text-gray-600 text-xs"></i>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                              title="수정"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <i className="fas fa-edit text-gray-600 text-xs"></i>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 cursor-pointer"
                              title="영수증 출력"
                            >
                              <i className="fas fa-receipt text-gray-600 text-xs"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* 다른 탭 콘텐츠들도 동일한 구조로 필터링만 다르게 */}
            <TabsContent value="sale" className="mt-6">
              <div className="text-center text-gray-500 py-8">
                매출 거래만 표시 (필터링 로직 구현 예정)
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="mt-6">
              <div className="text-center text-gray-500 py-8">
                매입 거래만 표시 (필터링 로직 구현 예정)
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="text-center text-gray-500 py-8">
                대기중 거래만 표시 (필터링 로직 구현 예정)
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* 거래 등록/수정 모달 */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={selectedTransaction}
        mode={modalMode}
      />
    </div>
  );
};

export default TransactionsPage;