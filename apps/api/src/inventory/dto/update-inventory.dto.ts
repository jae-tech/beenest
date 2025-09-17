import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @ApiProperty({
    description: '창고 위치',
    example: 'MAIN',
    default: 'MAIN',
  })
  @IsOptional()
  @IsString()
  warehouseLocation?: string;

  @ApiProperty({
    description: '예약 재고 수량',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reservedStock?: number;

  @ApiProperty({
    description: '최소 재고 수준',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minimumStock?: number;

  @ApiProperty({
    description: '최대 재고 수준',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maximumStock?: number;

  @ApiProperty({
    description: '재주문 기준점',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderPoint?: number;
}