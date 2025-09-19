import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-types.dto';

export class UpdateOrderDto {
  @ApiProperty({
    description: '주문 상태',
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    required: false,
    example: 'PENDING'
  })
  @IsOptional()
  @IsIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status?: string;

  @ApiProperty({ description: '예상 배송일', required: false })
  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @ApiProperty({ description: '주문 메모', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: '주문 항목 목록',
    type: () => [OrderItemDto],
    required: false,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}