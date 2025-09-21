import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MovementType, ReferenceType } from '@beenest/types';

export class AdjustStockDto {
  @ApiProperty({
    description: '재고 조정 수량 (절대값)',
    example: 10,
  })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: '재고 이동 타입',
    enum: MovementType,
    example: MovementType.ADJUST,
  })
  @IsEnum(MovementType)
  movementType: MovementType;

  @ApiProperty({
    description: '단위 원가 (입고시)',
    example: 25000,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  unitCost?: number;

  @ApiProperty({
    description: '참조 타입',
    enum: ReferenceType,
    example: ReferenceType.ADJUSTMENT,
    default: ReferenceType.ADJUSTMENT,
  })
  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @ApiProperty({
    description: '참조 ID (주문번호, 발주번호 등)',
    example: '1001',
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({
    description: '조정 사유/메모',
    example: '재고 실사 결과 조정',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: '조정 사유',
    example: '재고 실사',
    required: true,
  })
  @IsString()
  reason: string;
}