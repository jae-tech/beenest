import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto, RegisterDto } from '@/auth/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role = 'user' } = registerDto;

    // 이메일 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('이미 사용 중인 이메일입니다');
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 12);

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // JWT 토큰 생성
    const token = this.jwtService.sign({
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        ...user,
        id: user.id.toString(),
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 사용자 찾기 (활성 사용자만)
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다');
    }

    // 마지막 로그인 시간 업데이트
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // JWT 토큰 생성
    const token = this.jwtService.sign({
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        isActive: true,
        deletedAt: null,
      },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return {
        ...result,
        id: result.id.toString(),
      };
    }
    return null;
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: BigInt(id),
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: user.id.toString(),
    };
  }
}