import { useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTransaction, useUpdateTransaction } from "@/hooks/useTransactions";
import { transactionSchema, type TransactionFormData } from "@/schemas/transactionSchema";

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
import { DetailPageHeader } from "@/components/layout/DetailPageHeader";
import { TransactionType } from "@beenest/types";
import { toast } from "sonner";

interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function TransactionEditPage() {
  const navigate = useNavigate();
  const { transactionId } = useParams({ from: "/transactions/$transactionId/edit" });

  const { data: transactionResponse, isLoading } = useTransaction(transactionId);
  const updateTransaction = useUpdateTransaction();

  const transaction = transactionResponse?.data;

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시 상품 목록
  const mockProducts = [
    { id: "1", name: "상품 A", price: 10000 },
    { id: "2", name: "상품 B", price: 15000 },
    { id: "3", name: "상품 C", price: 20000 },
  ];

  // 임시 공급업체 목록
  const mockSuppliers = [
    { id: "1", name: "㈜한국자재" },
    { id: "2", name: "대한장비㈜" },
    { id: "3", name: "서울상사" },
  ];

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (transaction) {
      setFormData({
        transactionType: transaction.transactionType,
        transactionDate: transaction.transactionDate.split("T")[0],
        supplierId: transaction.supplier?.id || "",
        customerName: transaction.customerName || "",
        customerPhone: transaction.customerPhone || "",
        notes: transaction.notes || "",
      });

      if (transaction.items && transaction.items.length > 0) {
        setItems(
          transaction.items.map((item, index) => ({
            id: (index + 1).toString(),
            productId: item.product?.id || "",
            productName: item.product?.productName || "",
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: item.quantity * Number(item.unitPrice),
          }))
        );
      }
    }
  }, [transaction]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    if (field === "productId") {
      const product = mockProducts.find((p) => p.id === value);
      if (product) {
        updatedItems[index].productName = product.name;
        updatedItems[index].unitPrice = product.price;
      }
    }

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

  const handleSave = async () => {
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

      const validatedData = transactionSchema.parse(transactionData);

      if (validatedData.items.length === 0) {
        throw new Error("최소 1개의 품목을 선택해주세요");
      }

      if (validatedData.totalAmount <= 0) {
        throw new Error("총액은 0보다 커야 합니다");
      }

      await updateTransaction.mutateAsync({
        id: transactionId,
        data: validatedData,
      });

      toast.success("거래가 수정되었습니다");
      navigate({ to: `/transactions/${transactionId}` });
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("입력 정보를 확인해주세요");
      } else {
        toast.error(error.message || "수정 중 오류가 발생했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString("ko-KR")}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <DetailPageHeader
          title="거래 수정"
          description={`거래 ${transaction.transactionNumber} 수정`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/transactions/${transactionId}` })}
                className="cursor-pointer"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
                disabled={isSubmitting || items.length === 0 || !items.some(item => item.productId)}
              >
                {isSubmitting ? "수정 중..." : "수정"}
              </Button>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 거래 정보 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">거래 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transactionDate">거래일자</Label>
                  <Input
                    id="transactionDate"
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => handleFormChange("transactionDate", e.target.value)}
                    className={`mt-1 ${errors.transactionDate ? "border-red-500" : ""}`}
                  />
                  {errors.transactionDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.transactionDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="transactionType">거래 구분</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) => handleFormChange("transactionType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="거래 구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">매출</SelectItem>
                      <SelectItem value="PURCHASE">매입</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.transactionType === "PURCHASE" ? (
                  <div>
                    <Label htmlFor="supplierId">공급업체</Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) => handleFormChange("supplierId", value)}
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
                      <Label htmlFor="customerName">고객명</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleFormChange("customerName", e.target.value)}
                        placeholder="고객명을 입력하세요"
                        className={`mt-1 ${errors.customerName ? "border-red-500" : ""}`}
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">고객 연락처</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleFormChange("customerPhone", e.target.value)}
                        placeholder="연락처를 입력하세요"
                        className={`mt-1 ${errors.customerPhone ? "border-red-500" : ""}`}
                      />
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

            {/* 거래 품목 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">거래 품목</h3>
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
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <Label>상품</Label>
                        <Select
                          value={item.productId}
                          onValueChange={(value) => handleItemChange(index, "productId", value)}
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

                      <div className="col-span-2">
                        <Label>수량</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", parseInt(e.target.value) || 1)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label>단가</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", parseInt(e.target.value) || 0)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label>소계</Label>
                        <div className="p-2 text-sm font-bold text-gray-900 bg-white rounded border mt-1">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>

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

            {/* 금액 요약 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">금액 요약</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>공급가액:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>부가세 (10%):</span>
                  <span className="font-medium">{formatCurrency(calculateVAT())}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총액:</span>
                    <span className="text-yellow-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}