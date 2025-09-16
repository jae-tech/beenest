import { Button } from "@/shared/ui";
import { useMemo, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { useInventoryFilters } from "../hooks/useInventoryFilters";
import { InventoryTable } from "./InventoryTable";
import { AddInventoryForm } from "./AddInventoryForm";
import { Modal } from "@/shared/ui/modal";
import { type InventoryFormData } from "../schemas/inventorySchema";
import { Plus, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface InventoryPageProps {
  className?: string;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="상품명, SKU, 카테고리로 검색..."
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const StockFilter = ({
  minStock,
  maxStock,
  onMinStockChange,
  onMaxStockChange,
}: {
  minStock: string;
  maxStock: string;
  onMinStockChange: (value: string) => void;
  onMaxStockChange: (value: string) => void;
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">재고 범위</label>
    <div className="flex items-center space-x-2">
      <input
        type="number"
        value={minStock}
        onChange={(e) => onMinStockChange(e.target.value)}
        placeholder="최소"
        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="text-gray-500">~</span>
      <input
        type="number"
        value={maxStock}
        onChange={(e) => onMaxStockChange(e.target.value)}
        placeholder="최대"
        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
    ))}
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="text-center py-12 bg-white rounded-lg border">
    <div className="text-red-600 text-lg mb-4">{error}</div>
    <Button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      다시 시도
    </Button>
  </div>
);

export const InventoryPage = ({ className = "" }: InventoryPageProps) => {
  const { items, isLoading, error, refetch } = useInventory();
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    minStock,
    setMinStock,
    maxStock,
    setMaxStock,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearFilters,
  } = useInventoryFilters();

  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddInventory = (data: InventoryFormData) => {
    console.log('Adding inventory item:', data);
    setShowAddForm(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];

    const filtered = items.filter((item) => {
      // 검색어 필터
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      // 카테고리 필터
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        item.category === categoryFilter;

      // 재고 상태 필터
      const matchesStockStatus =
        !stockStatusFilter ||
        stockStatusFilter === "all" ||
        (stockStatusFilter === "in-stock" && item.quantity > 0) ||
        (stockStatusFilter === "low-stock" &&
          item.quantity > 0 &&
          item.quantity <= item.lowStockThreshold) ||
        (stockStatusFilter === "out-of-stock" && item.quantity === 0);

      // 재고 범위 필터
      const matchesStockRange =
        (!minStock || item.quantity >= parseInt(minStock)) &&
        (!maxStock || item.quantity <= parseInt(maxStock));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStockStatus &&
        matchesStockRange
      );
    });

    // 정렬
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [
    items,
    searchTerm,
    categoryFilter,
    stockStatusFilter,
    minStock,
    maxStock,
    sortBy,
    sortOrder,
  ]);

  const categoryOptions = useMemo(() => {
    if (!items) return [{ value: "all", label: "전체 카테고리" }];

    const categories = Array.from(new Set(items.map((item) => item.category)));
    return [
      { value: "all", label: "전체 카테고리" },
      ...categories.map((cat) => ({ value: cat, label: cat })),
    ];
  }, [items]);

  const stockStatusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "in-stock", label: "재고 있음" },
    { value: "low-stock", label: "재고 부족" },
    { value: "out-of-stock", label: "재고 없음" },
  ];

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">재고 관리</h1>
          <p className="text-gray-600">상품 재고를 관리하고 추적하세요</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">재고 관리</h1>
        </div>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 bg-gray-50 min-h-screen ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU, name, or category..."
                className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-200 rounded-md focus:border-yellow-400 focus:ring-yellow-400"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          <button className="border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FilterDropdown
                label="카테고리"
                value={categoryFilter}
                options={categoryOptions}
                onChange={setCategoryFilter}
              />
              <FilterDropdown
                label="재고 상태"
                value={stockStatusFilter}
                options={stockStatusOptions}
                onChange={setStockStatusFilter}
              />
              <StockFilter
                minStock={minStock}
                maxStock={maxStock}
                onMinStockChange={setMinStock}
                onMaxStockChange={setMaxStock}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="border border-gray-200 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-50"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}

        <InventoryTable
          items={filteredAndSortedItems}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setSortBy(field);
              setSortOrder("asc");
            }
          }}
        />

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing 1-{Math.min(filteredAndSortedItems.length, 5)} of{" "}
            {filteredAndSortedItems.length} items
          </p>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="bg-yellow-400 text-black px-2 py-1 rounded text-sm cursor-pointer">
              1
            </button>
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              2
            </button>
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              3
            </button>
            <button className="border border-gray-200 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <AddInventoryForm
          onSubmit={handleAddInventory}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>
    </div>
  );
};
