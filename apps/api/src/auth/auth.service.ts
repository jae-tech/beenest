import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '@/auth/dto';

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

    // JWT 토큰 및 Refresh 토큰 생성
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        ...user,
        id: user.id.toString(),
      },
      accessToken,
      refreshToken,
      // 기존 호환성을 위해 token 필드도 유지
      token: accessToken,
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

    // JWT 토큰 및 Refresh 토큰 생성
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

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
      accessToken,
      refreshToken,
      // 기존 호환성을 위해 token 필드도 유지
      token: accessToken,
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

  // ===== Refresh Token 관련 메서드들 =====

  /**
   * Access Token과 Refresh Token 생성
   */
  private async generateTokens(userId: bigint, email: string, role: string, deviceId?: string) {
    const payload = {
      sub: userId.toString(),
      email,
      role,
    };

    // Access Token 생성 (15분 만료)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    // Refresh Token 생성 (30일 만료)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30일 후 만료

    // 기존 사용자의 모든 refresh token 무효화 (보안상)
    await this.prisma.refreshToken.updateMany({
      where: { userId: userId },
      data: { isRevoked: true },
    });

    // 새 Refresh Token DB에 저장
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        deviceId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh Token으로 새 Access Token 발급
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken, deviceId } = refreshTokenDto;

    // Refresh Token 검증
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isRevoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > tokenRecord.expiresAt) {
      // 만료된 토큰 삭제
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // 사용자 상태 확인
    if (!tokenRecord.user.isActive || tokenRecord.user.deletedAt) {
      await this.revokeRefreshToken(refreshToken);
      throw new UnauthorizedException('User account is inactive');
    }

    // 마지막 사용 시간 업데이트
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { lastUsedAt: new Date() },
    });

    // 새로운 토큰 쌍 생성
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      tokenRecord.userId,
      tokenRecord.user.email,
      tokenRecord.user.role,
      deviceId
    );

    return {
      user: {
        id: tokenRecord.user.id.toString(),
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
        role: tokenRecord.user.role,
        isActive: tokenRecord.user.isActive,
        lastLoginAt: tokenRecord.user.lastLoginAt,
        createdAt: tokenRecord.user.createdAt,
      },
      accessToken,
      refreshToken: newRefreshToken,
      // 기존 호환성을 위해 token 필드도 유지
      token: accessToken,
    };
  }

  /**
   * Refresh Token 무효화
   */
  async revokeRefreshToken(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
  }

  /**
   * 사용자의 모든 Refresh Token 무효화 (로그아웃)
   */
  async revokeAllUserTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId: BigInt(userId) },
      data: { isRevoked: true },
    });
  }

  /**
   * 만료된 Refresh Token 정리 (크론잡용)
   */
  async cleanupExpiredTokens() {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true },
        ],
      },
    });
    return result.count;
  }
}