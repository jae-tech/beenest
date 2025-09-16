import { createFileRoute } from '@tanstack/react-router'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";

const DemoApp: React.FC = () => {
  const [currentView, setCurrentView] = useState("login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Beenest</h1>
            <p className="text-gray-600">소상공인을 위한 재고 및 거래처 관리 시스템</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <Input
                type="email"
                placeholder="admin@beenest.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <Input
                type="password"
                placeholder="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">비밀번호 찾기</a>
            </div>

            <Button
              type="button"
              onClick={() => setCurrentView("dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {!sidebarCollapsed && <span className="font-bold text-gray-900">Beenest</span>}
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {[
            { name: "대시보드", active: currentView === "dashboard" },
            { name: "재고관리", active: currentView === "inventory" },
            { name: "주문관리", active: currentView === "orders" },
            { name: "공급업체", active: currentView === "suppliers" }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.name.toLowerCase().replace("관리", "").replace("대시보드", "dashboard").replace("주문", "orders").replace("공급업체", "suppliers").replace("재고", "inventory"))}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {!sidebarCollapsed && item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                ☰
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === "dashboard" && "대시보드"}
                {currentView === "inventory" && "재고관리"}
                {currentView === "orders" && "주문관리"}
                {currentView === "suppliers" && "공급업체"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">관리자님</span>
              <Button
                onClick={() => setCurrentView("login")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "총 재고", value: "23,340", unit: "개", color: "bg-green-500", change: "+25%" },
                  { title: "재고 가치", value: "₩23,568,470", unit: "", color: "bg-yellow-500", change: "+25%" },
                  { title: "총 매출", value: "₩15,420,000", unit: "", color: "bg-blue-500", change: "+18%" },
                  { title: "신규 고객", value: "1,245", unit: "명", color: "bg-purple-500", change: "+12%" }
                ].map((metric, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color}`}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">{metric.change}</span>
                        <span className="text-xs text-gray-500">지난달 대비</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 추이</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">차트 영역</span>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 주문</h3>
                  <div className="space-y-4">
                    {[
                      { product: "백팩", customer: "김철수", amount: "₩200,000", status: "완료" },
                      { product: "티셔츠", customer: "이영희", amount: "₩89,000", status: "진행중" },
                      { product: "선글라스", customer: "박민수", amount: "₩150,000", status: "대기" }
                    ].map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.product}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{order.amount}</p>
                          <Badge variant={order.status === "완료" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentView === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">재고 관리</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  + 상품 추가
                </Button>
              </div>

              <Card className="p-6">
                <div className="mb-4">
                  <Input placeholder="상품명으로 검색..." className="max-w-sm" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">상품명</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">재고수량</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">단가</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "프리미엄 백팩", sku: "SKU-001", stock: 45, price: "₩89,000", status: "정상" },
                        { name: "코튼 티셔츠", sku: "SKU-002", stock: 12, price: "₩29,000", status: "부족" },
                        { name: "선글라스", sku: "SKU-003", stock: 0, price: "₩55,000", status: "품절" }
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                              <span className="font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{item.sku}</td>
                          <td className="py-4 px-4 text-gray-900">{item.stock}개</td>
                          <td className="py-4 px-4 text-gray-900">{item.price}</td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={item.status === "정상" ? "default" : item.status === "부족" ? "secondary" : "destructive"}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {currentView === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">주문 관리</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  + 새 주문
                </Button>
              </div>

              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="pending">대기중</TabsTrigger>
                  <TabsTrigger value="processing">처리중</TabsTrigger>
                  <TabsTrigger value="completed">완료</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <Card className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">주문번호</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">고객</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">상품</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">금액</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">상태</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">주문일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "#ORD001", customer: "김철수", product: "백팩", amount: "₩200,000", status: "완료", date: "2024-01-15" },
                            { id: "#ORD002", customer: "이영희", product: "티셔츠 x2", amount: "₩89,000", status: "처리중", date: "2024-01-14" },
                            { id: "#ORD003", customer: "박민수", product: "선글라스", amount: "₩150,000", status: "대기중", date: "2024-01-14" }
                          ].map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4 font-medium text-blue-600">{order.id}</td>
                              <td className="py-4 px-4 text-gray-900">{order.customer}</td>
                              <td className="py-4 px-4 text-gray-600">{order.product}</td>
                              <td className="py-4 px-4 font-medium text-gray-900">{order.amount}</td>
                              <td className="py-4 px-4">
                                <Badge variant={order.status === "완료" ? "default" : order.status === "처리중" ? "secondary" : "outline"}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{order.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentView === "suppliers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">공급업체 관리</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  + 공급업체 추가
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: "전체 공급업체", value: "156", color: "bg-blue-500" },
                  { title: "활성 공급업체", value: "142", color: "bg-green-500" },
                  { title: "대기 주문", value: "23", color: "bg-yellow-500" },
                  { title: "평균 평점", value: "4.8", color: "bg-purple-500" }
                ].map((stat, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <span className="text-white font-bold">📈</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <div className="mb-4">
                  <Input placeholder="공급업체명으로 검색..." className="max-w-sm" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">공급업체</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">연락처</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">상품수</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">평점</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "TechSupply Co.", contact: "tech@supply.com", products: 45, rating: 4.8, status: "활성" },
                        { name: "Fashion Hub", contact: "info@fashion.com", products: 23, rating: 4.5, status: "활성" },
                        { name: "Global Parts", contact: "sales@parts.com", products: 67, rating: 4.9, status: "대기" }
                      ].map((supplier, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 font-medium">{supplier.name.charAt(0)}</span>
                              </div>
                              <span className="font-medium text-gray-900">{supplier.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{supplier.contact}</td>
                          <td className="py-4 px-4 text-gray-900">{supplier.products}개</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-gray-900">{supplier.rating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={supplier.status === "활성" ? "default" : "secondary"}>
                              {supplier.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return currentView === "login" ? <LoginPage /> : <DashboardPage />;
};

export const Route = createFileRoute('/demo')({
  component: DemoApp,
})