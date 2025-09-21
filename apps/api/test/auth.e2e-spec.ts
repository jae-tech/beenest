import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: '테스트 사용자',
    companyName: '테스트 회사',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 전역 검증 파이프 설정 (실제 앱과 동일하게)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // 테스트 데이터 초기화
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
    await app.close();
  });

  async function cleanupDatabase() {
    // 관계형 데이터 순서에 맞게 삭제
    await prisma.refreshToken.deleteMany();
    await prisma.purchaseOrderItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.user.deleteMany();
  }

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
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
            companyName: testUser.companyName,
          },
        },
      });

      expect(response.body.data.user.id).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined(); // 비밀번호는 응답에 포함되지 않아야 함
    });

    it('should fail with invalid email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should fail with short password', async () => {
      const invalidUser = { ...testUser, password: '123' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      // 첫 번째 등록
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // 동일한 이메일로 다시 등록 시도
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409); // Conflict
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // 테스트용 사용자 미리 등록
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
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
            name: testUser.name,
            companyName: testUser.companyName,
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
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(401);
    });

    it('should fail with invalid password', async () => {
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

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // 사용자 등록 및 로그인하여 refresh token 획득
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh tokens successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '토큰 갱신 성공',
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // 새로운 토큰들이 기존과 다른지 확인
      expect(response.body.data.accessToken).not.toBe(refreshToken);
      expect(response.body.data.refreshToken).not.toBe(refreshToken);
    });

    it('should fail with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should fail with missing refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({})
        .expect(400);
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      // 사용자 등록 및 로그인하여 access token 획득
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get current user info with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: testUser.email,
          name: testUser.name,
          companyName: testUser.companyName,
        },
      });

      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.password).toBeUndefined();
    });

    it('should fail without authorization header', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should fail with malformed authorization header', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      // 사용자 등록 및 로그인
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      accessToken = loginResponse.body.data.accessToken;
      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: '로그아웃 성공',
      });

      // 로그아웃 후 refresh token이 무효화되었는지 확인
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('should fail without authorization header', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });

  describe('Auth Flow Integration', () => {
    it('should complete full auth cycle: register → login → access protected route → refresh → logout', async () => {
      // 1. 회원가입
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);

      // 2. 로그인
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const { accessToken, refreshToken } = loginResponse.body.data;

      // 3. 보호된 라우트 접근 (현재 사용자 정보 조회)
      const meResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(meResponse.body.data.email).toBe(testUser.email);

      // 4. 토큰 갱신
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      const newAccessToken = refreshResponse.body.data.accessToken;
      expect(newAccessToken).not.toBe(accessToken);

      // 5. 새 토큰으로 보호된 라우트 접근
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      // 6. 로그아웃
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      // 7. 로그아웃 후 토큰 무효화 확인
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(401);
    });
  });
});