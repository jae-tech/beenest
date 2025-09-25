import { DetailPageHeader } from "@/components/layout/DetailPageHeader";
import { Badge } from "@/components/ui/badge";
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
import { transactionSchema, type TransactionFormData } from "@/schemas/transactionSchema";
import { TransactionType } from "@beenest/types";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function AddTransactionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transactionType: "SALE" as TransactionType,
    transactionDate: new Date().toISOString().split("T")[0],
    supplierId: "",
    customerName: "",
    customerPhone: "",
    notes: "",
  });

  const [items, setItems] = useState<TransactionItem[]>([
    {
      id: "1",
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  // Validation 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시 상품 목록 (실제로는 API에서 가져올 예정)
  const mockProducts = [
    { id: "1", name: "상품 A", price: 10000 },
    { id: "2", name: "상품 B", price: 15000 },
    { id: "3", name: "상품 C", price: 20000 },
  ];

  // 임시 공급업체 목록 (실제로는 API에서 가져올 예정)
  const mockSuppliers = [
    { id: "1", name: "㈜한국자재" },
    { id: "2", name: "대한장비㈜" },
    { id: "3", name: "서울상사" },
  ];

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // 상품 선택 시 이름과 단가 자동 설정
    if (field === "productId") {
      const product = mockProducts.find((p) => p.id === value);
      if (product) {
        updatedItems[index].productName = product.name;
        updatedItems[index].unitPrice = product.price;
      }
    }

    // 수량 또는 단가 변경 시 총액 계산
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].totalPrice =
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateVAT = () => {
    return Math.round(calculateSubtotal() * 0.1);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const validateAndSave = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const transactionData = {
        ...formData,
        transactionType: formData.transactionType as TransactionType,
        items: items.filter((item) => item.productId && item.quantity > 0),
        subtotalAmount: calculateSubtotal(),
        vatAmount: calculateVAT(),
        totalAmount: calculateTotal(),
      };

      // Zod validation
      const validatedData = transactionSchema.parse(transactionData);

      // 추가 비즈니스 로직 검증
      if (validatedData.items.length === 0) {
        throw new Error("최소 1개의 품목을 선택해주세요");
      }

      if (validatedData.totalAmount <= 0) {
        throw new Error("총액은 0보다 커야 합니다");
      }

      // 성공 시 저장 및 리다이렉트
      // TODO: API 호출로 실제 저장
      console.log("Transaction data:", validatedData);
      toast.success("거래가 등록되었습니다");
      navigate({ to: "/transactions" });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation 에러
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("입력 정보를 확인해주세요");
      } else {
        // 일반 에러
        toast.error(error.message || "저장 중 오류가 발생했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    validateAndSave();
  };

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString("ko-KR")}`;
  };

  return (
    <div className="flex h-full">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <DetailPageHeader
          title="거래 등록"
          description="새로운 거래를 등록하세요"
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/transactions" })}
                className="cursor-pointer"
              >
                취소
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="cursor-pointer"
                disabled={
                  isSubmitting ||
                  items.length === 0 ||
                  !items.some((item) => item.productId)
                }
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    등록 중...
                  </>
                ) : (
                  "등록"
                )}
              </Button>
            </div>
          }
        />

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 5가지 핵심 요소 입력 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                거래 정보 (5가지 핵심 요소)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 언제 - 거래일자 */}
                <div>
                  <Label
                    htmlFor="transactionDate"
                    className="flex items-center"
                  >
                    <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                    거래일자 (언제)
                  </Label>
                  <Input
                    id="transactionDate"
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) =>
                      handleFormChange("transactionDate", e.target.value)
                    }
                    className={`mt-1 ${errors.transactionDate ? "border-red-500" : ""}`}
                  />
                  {errors.transactionDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionDate}
                    </p>
                  )}
                </div>

                {/* 거래 구분 */}
                <div>
                  <Label htmlFor="transactionType" className="form-label">거래 구분</Label>
                  <div className="transaction-type-selector">
                    <div
                      className={`transaction-type-card ${formData.transactionType === "PURCHASE" ? "selected" : ""}`}
                      onClick={() => handleFormChange("transactionType", "PURCHASE")}
                    >
                      <div className="transaction-type-icon">📦</div>
                      <div className="transaction-type-label">매입</div>
                    </div>
                    <div
                      className={`transaction-type-card ${formData.transactionType === "SALE" ? "selected" : ""}`}
                      onClick={() => handleFormChange("transactionType", "SALE")}
                    >
                      <div className="transaction-type-icon">💰</div>
                      <div className="transaction-type-label">매출</div>
                    </div>
                  </div>
                </div>

                {/* 2. 누구와 - 거래처 */}
                {formData.transactionType === "PURCHASE" ? (
                  <div>
                    <Label htmlFor="supplierId" className="flex items-center">
                      <i className="fas fa-building mr-2 text-green-500"></i>
                      공급업체 (누구와)
                    </Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) =>
                        handleFormChange("supplierId", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="공급업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSuppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label
                        htmlFor="customerName"
                        className="flex items-center"
                      >
                        <i className="fas fa-user mr-2 text-green-500"></i>
                        고객명 (누구와)
                      </Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) =>
                          handleFormChange("customerName", e.target.value)
                        }
                        placeholder="고객명을 입력하세요"
                        className={`mt-1 ${errors.customerName ? "border-red-500" : ""}`}
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.customerName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">고객 연락처</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          handleFormChange("customerPhone", e.target.value)
                        }
                        placeholder="연락처를 입력하세요"
                        className={`mt-1 ${errors.customerPhone ? "border-red-500" : ""}`}
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.customerPhone}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="notes">메모</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleFormChange("notes", e.target.value)}
                    placeholder="거래 관련 메모를 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* 3, 4, 5번 요소: 무엇을, 얼마나, 얼마에 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <i className="fas fa-box mr-2 text-orange-500"></i>
                  거래 품목 (무엇을, 얼마나, 얼마에)
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="cursor-pointer"
                >
                  <i className="fas fa-plus mr-2"></i>
                  품목 추가
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-12 gap-4 items-end">
                      {/* 3. 무엇을 - 품목 */}
                      <div className="col-span-5">
                        <Label className="flex items-center">
                          <i className="fas fa-tag mr-2 text-purple-500"></i>
                          품목 (무엇을)
                        </Label>
                        <Select
                          value={item.productId}
                          onValueChange={(value) =>
                            handleItemChange(index, "productId", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="상품 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 4. 얼마나 - 수량 */}
                      <div className="col-span-2">
                        <Label className="flex items-center">
                          <i className="fas fa-calculator mr-2 text-yellow-500"></i>
                          수량 (얼마나)
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="mt-1"
                        />
                      </div>

                      {/* 5. 얼마에 - 단가 */}
                      <div className="col-span-2">
                        <Label className="flex items-center">
                          <i className="fas fa-won-sign mr-2 text-red-500"></i>
                          단가 (얼마에)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "unitPrice",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>

                      {/* 소계 */}
                      <div className="col-span-2">
                        <Label>소계</Label>
                        <div className="p-2 text-sm font-bold text-gray-900 bg-white rounded border mt-1">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="cursor-pointer p-2 mt-6"
                        >
                          <i className="fas fa-trash text-red-500"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 사이드바 영역 */}
      <div className="w-80 border-l bg-gray-50 flex flex-col">
        {/* 미리보기 카드 */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">거래 미리보기</h3>
          <Card className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">거래 구분:</span>
                <Badge
                  variant={
                    formData.transactionType === "SALE"
                      ? "default"
                      : "secondary"
                  }
                >
                  {formData.transactionType === "SALE" ? "매출" : "매입"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">거래일자:</span>
                <span>{formData.transactionDate || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">품목 수:</span>
                <span>{items.filter((item) => item.productId).length}개</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">공급가액:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">부가세:</span>
                  <span>{formatCurrency(calculateVAT())}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>총액:</span>
                  <span className="text-yellow-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 도움말 카드 */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">거래 등록 가이드</h3>
          <Card className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <i className="fas fa-calendar-alt text-blue-500 mr-2 mt-1"></i>
                <div>
                  <div className="font-medium">언제</div>
                  <div className="text-gray-600">
                    거래가 발생한 날짜를 선택하세요
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-user text-green-500 mr-2 mt-1"></i>
                <div>
                  <div className="font-medium">누구와</div>
                  <div className="text-gray-600">
                    매출: 고객정보, 매입: 공급업체
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <i className="fas fa-box text-orange-500 mr-2 mt-1"></i>
                <div>
                  <div className="font-medium">무엇을, 얼마나, 얼마에</div>
                  <div className="text-gray-600">
                    상품, 수량, 단가를 입력하세요
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
