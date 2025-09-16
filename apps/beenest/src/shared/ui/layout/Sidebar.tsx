import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Link } from '@tanstack/react-router';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Store,
  Truck,
  FileBarChart,
  HelpCircle,
  Settings,
  Shield,
  Crown,
  Cube
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Store, label: "Suppliers", path: "/suppliers" },
    { icon: Truck, label: "Shipment", path: "/shipment" },
    { icon: FileBarChart, label: "Reports", path: "/reports" },
  ];
  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} min-h-screen flex flex-col`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Cube className="w-4 h-4 text-black" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold">Beenest</span>}
        </div>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4 mb-4">
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              MENU
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
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-300 hover:bg-gray-800 [&.active]:bg-yellow-400 [&.active]:text-black"
              >
                <IconComponent className="w-4 h-4" />
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
              GENERAL
            </span>
          )}
        </div>
        <nav className="space-y-1 px-2">
          {[
            { icon: HelpCircle, label: "Help" },
            { icon: Settings, label: "Settings" },
            { icon: Shield, label: "Privacy" },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <IconComponent className="w-4 h-4" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <Card className="p-4 bg-gray-800 border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Upgrade to Pro
                </h4>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Unlock premium features with 20% off - for a limited time!
            </p>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-semibold !rounded-button whitespace-nowrap cursor-pointer">
              Upgrade Now
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
