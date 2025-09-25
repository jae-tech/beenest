import { useUIStore } from "@/app/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Plus, Search, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className = "" }: HeaderProps) => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className={`bg-white border-b border-gray-100 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label={sidebarCollapsed ? "사이드바 열기" : "사이드바 닫기"}
            title={sidebarCollapsed ? "사이드바 열기" : "사이드바 닫기"}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="재고, 주문, 고객 검색..."
              className="w-80 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              aria-label="전체 검색"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <Link to="/settings">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              aria-label="설정"
              title="설정"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer"
            aria-label="알림 (3개의 읽지 않은 알림)"
            title="알림"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Link to="/products/add">
            <Button
              className="font-semibold whitespace-nowrap cursor-pointer shadow-md"
              aria-label="새 상품 등록하기"
            >
              <Plus className="w-4 h-4 mr-2" />
              신규 상품 등록
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
