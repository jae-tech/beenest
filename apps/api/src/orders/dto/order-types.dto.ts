import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: '상품 ID',
    example: '1'
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    description: '주문 수량',
    example: 10,
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: '단가',
    required: false,
    example: 5000,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}