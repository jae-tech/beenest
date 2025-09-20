import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: 'current123!',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: '현재 비밀번호를 입력해주세요' })
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPassword123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다' })
  @MaxLength(128, { message: '새 비밀번호는 최대 128자까지 가능합니다' })
  @IsNotEmpty({ message: '새 비밀번호를 입력해주세요' })
  newPassword: string;

  @ApiProperty({
    description: '새 비밀번호 확인',
    example: 'newPassword123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8, { message: '비밀번호 확인은 최소 8자 이상이어야 합니다' })
  @MaxLength(128, { message: '비밀번호 확인은 최대 128자까지 가능합니다' })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요' })
  confirmPassword: string;
}