import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CloudUpload, Package, Save, X } from "lucide-react";
import React, { useState } from "react";

export function AddProductPage() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    description: "",
    unitPrice: "",
    initialStock: "",
    supplier: "",
    minStockThreshold: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log("상품 저장:", formData);
    // 저장 로직 구현
  };

  const handleCancel = () => {
    console.log("취소됨");
    navigate({ to: "/inventory" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="p-2 border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">새 상품 추가</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-black" />
            </div>
            <span className="text-xl font-bold text-gray-900">Beenest</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 shadow-lg border-0 bg-white">
          <div className="space-y-8">
            {/* 기본 정보 섹션 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                기본 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="productName"
                    className="text-sm font-medium text-gray-700"
                  >
                    상품명 *
                  </Label>
                  <Input
                    id="productName"
                    placeholder="상품명을 입력하세요"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="sku"
                    className="text-sm font-medium text-gray-700"
                  >
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    placeholder="SKU를 입력하세요 (예: WH-001)"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    카테고리 *
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">전자제품</SelectItem>
                      <SelectItem value="apparel">의류</SelectItem>
                      <SelectItem value="accessories">액세서리</SelectItem>
                      <SelectItem value="footwear">신발</SelectItem>
                      <SelectItem value="home">홈&리빙</SelectItem>
                      <SelectItem value="sports">스포츠</SelectItem>
                      <SelectItem value="books">도서</SelectItem>
                      <SelectItem value="beauty">뷰티</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="supplier"
                    className="text-sm font-medium text-gray-700"
                  >
                    공급업체 *
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("supplier", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm">
                      <SelectValue placeholder="공급업체를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techsupply">TechSupply Co.</SelectItem>
                      <SelectItem value="globalelec">
                        Global Electronics
                      </SelectItem>
                      <SelectItem value="fashionfw">Fashion Forward</SelectItem>
                      <SelectItem value="sportsgear">
                        Sports Gear Ltd
                      </SelectItem>
                      <SelectItem value="homeessentials">
                        Home Essentials Inc
                      </SelectItem>
                      <SelectItem value="beautyworld">
                        Beauty World Co.
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  상품 설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="상품에 대한 자세한 설명을 입력하세요..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-24 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* 가격 및 재고 정보 섹션 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                가격 및 재고 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="unitPrice"
                    className="text-sm font-medium text-gray-700"
                  >
                    단가 *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      ₩
                    </span>
                    <Input
                      id="unitPrice"
                      type="number"
                      placeholder="0"
                      value={formData.unitPrice}
                      onChange={(e) =>
                        handleInputChange("unitPrice", e.target.value)
                      }
                      className="h-12 pl-8 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="initialStock"
                    className="text-sm font-medium text-gray-700"
                  >
                    초기 재고 수량 *
                  </Label>
                  <Input
                    id="initialStock"
                    type="number"
                    placeholder="0"
                    value={formData.initialStock}
                    onChange={(e) =>
                      handleInputChange("initialStock", e.target.value)
                    }
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="minStockThreshold"
                    className="text-sm font-medium text-gray-700"
                  >
                    최소 재고 기준치 *
                  </Label>
                  <Input
                    id="minStockThreshold"
                    type="number"
                    placeholder="0"
                    value={formData.minStockThreshold}
                    onChange={(e) =>
                      handleInputChange("minStockThreshold", e.target.value)
                    }
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 상품 이미지 섹션 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                상품 이미지
              </h2>

              <div className="space-y-4">
                {/* 이미지 업로드 영역 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <CloudUpload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          이미지를 업로드하세요
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, GIF 파일을 드래그하거나 클릭하여 선택하세요
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          최대 10개 파일, 각 파일당 최대 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* 업로드된 이미지 미리보기 */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`업로드된 이미지 ${index + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-medium">
                            대표 이미지
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 샘플 이미지들 */}
                {uploadedImages.length === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={`https://readdy.ai/api/search-image?query=modern%20product%20placeholder%20image%20with%20clean%20white%20background%20minimal%20design%20professional%20ecommerce%20style%20photography&width=200&height=200&seq=placeholder-${index}&orientation=squarish`}
                          alt={`상품 이미지 샘플 ${index}`}
                          className="w-full h-full object-cover object-top opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 하단 액션 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer"
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold whitespace-nowrap cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              상품 저장하기
            </Button>
          </div>
        </div>

        {/* 하단 여백 (고정 버튼을 위한) */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
