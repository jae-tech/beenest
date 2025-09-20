import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { AuthModule } from '@/auth/auth.module';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';

// Mock 데이터
const mockUser = {
  id: BigInt(1),
  email: 'test@example.com',
  passwordHash: '$2b$10$hashedpassword',
  name: '테스트 사용자',
  role: 'user',
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockRefreshToken = {
  id: BigInt(1),
  token: 'mock-refresh-token',
  userId: BigInt(1),
  deviceId: null,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
  isRevoked: false,
  lastUsedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Auth Mock E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: '테스트 사용자',
  };

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret-key',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn(),
              create: vi.fn(),
              findFirst: vi.fn(),
              update: vi.fn(),
            },
            refreshToken: {
              create: vi.fn(),
              findFirst: vi.fn(),
              findUnique: vi.fn(),
              deleteMany: vi.fn(),
              updateMany: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
            $transaction: vi.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock setup
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(null);
      vi.mocked(prismaService.user.create).mockResolvedValue({
        ...mockUser,
        email: testUser.email,
        name: testUser.name,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: '회원가입이 완료되었습니다',
        data: {
          user: {
            email: testUser.email,
            name: testUser.name,
              },
        },
      });

      expect(response.body.data.user.id).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should fail with invalid email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      // Mock existing user
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(mockUser);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock user exists and password matches
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(mockUser);
      vi.mocked(prismaService.refreshToken.create).mockResolvedValue(mockRefreshToken);

      // Mock bcrypt.compare to return true
      const bcrypt = await import('bcrypt');
      vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true as any));

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '로그인 성공',
        data: {
          user: {
            email: testUser.email,
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // JWT 토큰 형식 검증
      expect(response.body.data.accessToken).toMatch(/^eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);
      expect(response.body.data.refreshToken).toMatch(/^eyJ[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/);
    });

    it('should fail with invalid email', async () => {
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(401);
    });

    it('should fail with invalid password', async () => {
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false
      const bcrypt = await import('bcrypt');
      vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false as any));

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with missing credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          // password 누락
        })
        .expect(400);
    });
  });

  describe('Authentication Flow Mock Tests', () => {
    it('should validate JWT token structure', async () => {
      // Mock successful login
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(mockUser);
      vi.mocked(prismaService.refreshToken.create).mockResolvedValue(mockRefreshToken);

      const bcrypt = await import('bcrypt');
      vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true as any));

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const { accessToken, refreshToken } = response.body.data;

      // JWT 구조 검증
      expect(accessToken.split('.')).toHaveLength(3);
      expect(refreshToken.split('.')).toHaveLength(3);

      // Base64 디코딩 테스트
      const [header, payload] = accessToken.split('.');
      const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

      expect(decodedHeader).toMatchObject({
        typ: 'JWT',
        alg: 'HS256',
      });

      expect(decodedPayload).toMatchObject({
        sub: '1',
        email: testUser.email,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });

    it('should handle validation errors correctly', async () => {
      const testCases = [
        {
          data: { email: '', password: 'test123' },
          description: 'empty email',
        },
        {
          data: { email: 'test@test.com', password: '' },
          description: 'empty password',
        },
        {
          data: { email: 'invalid-email', password: 'test123' },
          description: 'invalid email format',
        },
        {
          data: { email: 'test@test.com', password: '12' },
          description: 'password too short',
        },
      ];

      for (const testCase of testCases) {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(testCase.data);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('API Response Format Validation', () => {
    it('should return consistent success response format', async () => {
      vi.mocked(prismaService.user.findFirst).mockResolvedValue(null);
      vi.mocked(prismaService.user.create).mockResolvedValue({
        ...mockUser,
        email: testUser.email,
        name: testUser.name,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // 응답 구조 검증
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');

      expect(typeof response.body.success).toBe('boolean');
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.data).toBe('object');
    });

    it('should return consistent error response format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email' })
        .expect(400);

      // 에러 응답 구조 검증
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
      expect(typeof response.body.message).toBe('string');
    });
  });
});