import { SupplierStatus } from '@beenest/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: '거래처 코드 (유니크)',
    example: 'SUP001',
  })
  @IsString()
  @IsNotEmpty()
  supplierCode: string;

  @ApiProperty({
    description: '회사명',
    example: '테크노 일렉트로닉스 주식회사',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: '담당자명',
    example: '김기술',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({
    description: '이메일',
    example: 'kim.tech@techno-electronics.co.kr',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: '전화번호',
    example: '02-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    description: '팩스번호',
    example: '02-1234-5679',
    required: false,
  })
  @IsOptional()
  @IsString()
  fax?: string;

  @ApiProperty({
    description: '사업자등록번호',
    example: '123-45-67890',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessRegistration?: string;

  @ApiProperty({
    description: '세금 ID',
    example: 'KR1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({
    description: '주소 (첫 번째 줄)',
    example: '서울특별시 강남구 테헤란로 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({
    description: '주소 (두 번째 줄)',
    example: '테크노빌딩 5층',
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    description: '도시',
    example: '서울',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: '주/도',
    example: '서울특별시',
    required: false,
  })
  @IsOptional()
  @IsString()
  stateProvince?: string;

  @ApiProperty({
    description: '우편번호',
    example: '06142',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: '국가',
    example: 'KR',
    default: 'KR',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: '결제 조건',
    example: '월말 결제',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({
    description: '신용 한도 (원)',
    example: 50000000,
    default: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  creditLimit?: number;

  @ApiProperty({
    description: '평점 (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiProperty({
    description: '거래처 상태',
    example: 'active',
    enum: SupplierStatus,
    default: 'active',
  })
  @IsOptional()
  @IsEnum(SupplierStatus)
  supplierStatus?: SupplierStatus;

  @ApiProperty({
    description: '비고',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

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
