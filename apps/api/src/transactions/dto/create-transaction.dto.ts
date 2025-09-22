import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';
import { CreateTransactionItemDto } from './create-transaction-item.dto';

export class CreateTransactionDto {
  @ApiProperty({
    description: '거래 타입',
    enum: TransactionType,
    example: TransactionType.SALE,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @ApiProperty({
    description: '거래 일자',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  transactionDate: string;

  @ApiProperty({
    description: '공급업체 ID (매입 거래시 필수)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  supplierId?: number;

  @ApiProperty({
    description: '고객명 (매출 거래시)',
    example: '카페 온더코너',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    description: '고객 연락처 (매출 거래시)',
    example: '02-555-1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    description: '메모',
    example: '신규 카페 오픈 축하 할인 10% 적용',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: '거래 품목 목록',
    type: [CreateTransactionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];
}