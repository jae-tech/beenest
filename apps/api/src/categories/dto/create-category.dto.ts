import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: '카테고리명',
    example: '전자제품',
  })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({
    description: '부모 카테고리 ID (계층 구조)',
    example: '1',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value ? BigInt(value) : undefined)
  parentCategoryId?: bigint;

  @ApiProperty({
    description: '표시 순서',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  displayOrder?: number;

  @ApiProperty({
    description: '활성 상태',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}