import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ description: '상품 ID' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: '주문 수량' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '단가', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: '공급업체 ID' })
  @IsNotEmpty()
  @IsString()
  supplierId: string;

  @ApiProperty({ description: '주문 항목들', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: '예상 배송일', required: false })
  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @ApiProperty({ description: '주문 메모', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}