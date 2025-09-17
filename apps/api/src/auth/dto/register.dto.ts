import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export class RegisterDto {
  @ApiProperty({
    description: '이메일',
    example: 'user@beenest.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요' })
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  password: string;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  @IsString({ message: '이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  name: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: '올바른 역할을 선택해주세요' })
  role?: UserRole;
}