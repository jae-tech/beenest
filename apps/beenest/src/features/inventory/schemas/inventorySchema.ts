import { z } from 'zod'

export const inventorySchema = z.object({
  name: z.string().min(1, '상품명을 입력해주세요'),
  sku: z.string().min(1, 'SKU를 입력해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  stock: z.number().min(0, '재고는 0 이상이어야 합니다'),
  price: z.number().min(0, '가격은 0 이상이어야 합니다'),
})

export type InventoryFormData = z.infer<typeof inventorySchema>