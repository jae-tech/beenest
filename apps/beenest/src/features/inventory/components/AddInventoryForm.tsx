import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inventorySchema, type InventoryFormData } from '../schemas/inventorySchema'
import { Form, FormField } from '@/shared/ui/form'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

interface AddInventoryFormProps {
  onSubmit: (data: InventoryFormData) => void
  onCancel: () => void
}

export const AddInventoryForm = ({ onSubmit, onCancel }: AddInventoryFormProps) => {
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      stock: 0,
      price: 0,
    }
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Inventory Item</h3>

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="name"
            label="Product Name"
            placeholder="Enter product name"
          />

          <FormField
            name="sku"
            label="SKU"
            placeholder="Enter SKU"
          />

          <FormField
            name="category"
            label="Category"
            placeholder="Enter category"
          />

          <FormField
            name="stock"
            label="Stock Quantity"
            type="number"
            placeholder="0"
          />

          <FormField
            name="price"
            label="Unit Price"
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
            {form.formState.isSubmitting ? 'Adding...' : 'Add Item'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  )
}