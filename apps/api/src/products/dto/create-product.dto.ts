import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: '상품 코드 (유니크)',
    example: 'PRD001',
  })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiProperty({
    description: '상품명',
    example: '무선 블루투스 헤드폰 WH-1000XM5',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: '상품 설명',
    example: '업계 최고 수준의 노이즈 캔슬링과 고음질을 자랑하는 프리미엄 헤드폰',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '카테고리 ID',
    example: '1',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value ? BigInt(value) : undefined)
  categoryId?: bigint;

  @ApiProperty({
    description: '판매 단가',
    example: 399000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  unitPrice: number;

  @ApiProperty({
    description: '원가',
    example: 280000,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  costPrice?: number;

  @ApiProperty({
    description: '바코드',
    example: '8801234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    description: '무게 (g)',
    example: 250,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  weight?: number;

  @ApiProperty({
    description: '규격/치수',
    example: '20cm x 18cm x 8cm',
    required: false,
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({
    description: '상품 이미지 URL',
    example: '/images/headphone-wh1000xm5.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: '활성 상태',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  // 초기 재고 설정 (선택사항)
  @ApiProperty({
    description: '초기 재고 수량',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  initialStock?: number;

  @ApiProperty({
    description: '최소 재고 수준',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minimumStock?: number;

  @ApiProperty({
    description: '최대 재고 수준',
    example: 300,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maximumStock?: number;

  @ApiProperty({
    description: '재주문 기준점',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderPoint?: number;
}