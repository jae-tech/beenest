import { useAuthStore } from "@/app/store/authStore";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Box,
  ClipboardList,
  DollarSign,
  HelpCircle,
  LogOut,
  Package,
  Settings,
  Shield,
  Store,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const logout = useAuthStore((state) => state.logout);
  const menuItems = [
    { icon: BarChart3, label: "대시보드", path: "/dashboard" },
    { icon: Package, label: "상품관리", path: "/products" },
    { icon: ClipboardList, label: "재고현황", path: "/inventory" },
    { icon: DollarSign, label: "매입/매출", path: "/transactions" },
    // { icon: ShoppingCart, label: "주문관리", path: "/orders" },
    // { icon: Users, label: "고객관리", path: "/customers" },
    { icon: Store, label: "거래처", path: "/suppliers" },
    // { icon: Truck, label: "배송관리", path: "/shipment" },
    // { icon: FileBarChart, label: "보고서", path: "/reports" },
  ];
  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} h-full flex flex-col`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Box className="w-4 h-4 text-black" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold">Beenest</span>}
        </div>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4 mb-4">
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              메뉴
            </span>
          )}
        </div>
        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 [&.active]:bg-yellow-400 [&.active]:text-black"
                aria-label={item.label}
                title={item.label}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-8 mb-4">
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              일반
            </span>
          )}
        </div>
        <nav className="space-y-1 px-2">
          <button
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="도움말"
            title="도움말"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">도움말</span>
            )}
          </button>
          <Link
            to="/settings"
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 [&.active]:bg-yellow-400 [&.active]:text-black"
            aria-label="설정"
            title="설정"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">설정</span>}
          </Link>
          <button
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="개인정보 설정"
            title="개인정보 설정"
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">개인정보</span>
            )}
          </button>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          className={`w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isCollapsed ? "justify-center" : ""}`}
          onClick={logout}
          aria-label="로그아웃"
          title="로그아웃"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">로그아웃</span>
          )}
        </button>
      </div>
    </div>
  );
};
