import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-types.dto';
import { OrderStatus } from '@beenest/types';

export class UpdateOrderDto {
  @ApiProperty({
    description: '주문 상태',
    enum: OrderStatus,
    required: false,
    example: 'PENDING'
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

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