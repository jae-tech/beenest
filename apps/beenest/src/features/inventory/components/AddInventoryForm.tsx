import { Form, FormField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  inventorySchema,
  type InventoryFormData,
} from "../schemas/inventorySchema";

interface AddInventoryFormProps {
  onSubmit: (data: InventoryFormData) => void;
  onCancel: () => void;
}

export const AddInventoryForm = ({
  onSubmit,
  onCancel,
}: AddInventoryFormProps) => {
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      stock: 0,
      price: 0,
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        신규 재고 등록
      </h3>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="name"
            label="상품명"
            placeholder="상품명을 입력하세요"
          />

          <FormField name="sku" label="SKU" placeholder="SKU를 입력하세요" />

          <FormField
            name="category"
            label="카테고리"
            placeholder="카테고리를 입력하세요"
          />

          <FormField
            name="stock"
            label="재고 수량"
            type="number"
            placeholder="0"
          />

          <FormField
            name="price"
            label="단가"
            type="number"
            placeholder="0.00"
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer"
          >
            {form.formState.isSubmitting ? "등록 중..." : "등록하기"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            취소
          </Button>
        </div>
      </Form>
    </Card>
  );
};
