import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-types.dto';

export class CreateOrderDto {
  @ApiProperty({ description: '공급업체 ID' })
  @IsNotEmpty()
  @IsString()
  supplierId: string;

  @ApiProperty({
    description: '주문 항목 목록',
    type: () => [OrderItemDto],
    isArray: true
  })
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