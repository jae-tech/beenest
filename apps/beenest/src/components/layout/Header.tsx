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
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="재고, 주문, 고객 검색..."
              className="w-80 pl-10 pr-4 py-2 text-sm"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            className="p-2 cursor-pointer"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            className="p-2 border-gray-100 hover:bg-gray-50 relative cursor-pointer"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Link to="/products/add">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              신규 상품 등록
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
