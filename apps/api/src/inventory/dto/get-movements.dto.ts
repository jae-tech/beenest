import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { MovementType, ReferenceType } from '@beenest/types';

export class GetMovementsDto {
  @ApiProperty({
    description: '페이지 번호',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({
    description: '페이지당 항목 수',
    example: 20,
    required: false,
    default: 20,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({
    description: '특정 상품으로 필터링',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  productId?: string;
}

export class MovementResponseDto {
  @ApiProperty({ description: '재고 이동 ID' })
  id: string;

  @ApiProperty({ description: '상품 ID' })
  productId: string;

  @ApiProperty({ description: '이동 타입', enum: MovementType })
  movementType: MovementType;

  @ApiProperty({ description: '수량' })
  quantity: number;

  @ApiProperty({ description: '단가', required: false })
  unitCost?: number;

  @ApiProperty({ description: '참조 타입', enum: ReferenceType, required: false })
  referenceType?: ReferenceType;

  @ApiProperty({ description: '참조 ID', required: false })
  referenceId?: string;

  @ApiProperty({ description: '메모', required: false })
  notes?: string;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '생성자 정보' })
  creator: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: '상품 정보' })
  product: {
    id: string;
    productCode: string;
    productName: string;
    unitPrice: number;
    category?: {
      id: string;
      categoryName: string;
    } | null;
  };
}

export class MovementsResponseDto {
  @ApiProperty({ description: '재고 이동 목록', type: [MovementResponseDto] })
  data: MovementResponseDto[];

  @ApiProperty({ description: '페이지네이션 정보' })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}