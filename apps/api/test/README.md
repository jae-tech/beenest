# Beenest API E2E 테스트 가이드

이 문서는 Beenest API의 E2E (End-to-End) 테스트 구성과 실행 방법을 설명합니다.

## 📋 테스트 개요

### 구현된 E2E 테스트

- ✅ **인증 플로우 테스트** (`auth.e2e-spec.ts`)
  - 회원가입, 로그인, 토큰 갱신, 로그아웃
  - JWT 토큰 검증 및 보안 테스트
  - 전체 인증 사이클 통합 테스트

- ✅ **상품 관리 플로우 테스트** (`products.e2e-spec.ts`)
  - 상품 등록, 조회, 수정, 삭제
  - 재고 관리 및 조정
  - 검색 및 필터링 기능
  - 저재고 알림 기능

- ✅ **주문 관리 플로우 테스트** (`orders.e2e-spec.ts`)
  - 주문 생성, 상태 변경, 취소
  - 주문 상세 조회 및 수정
  - 주문 통계 및 리포팅
  - 전체 주문 라이프사이클 테스트

## 🛠 테스트 환경 설정

### 1. 테스트 데이터베이스 설정

E2E 테스트는 실제 데이터베이스를 사용합니다. 별도의 테스트 데이터베이스를 설정해야 합니다.

```bash
# PostgreSQL에서 테스트 데이터베이스 생성
createdb beenest_test

# 또는 환경변수로 테스트 DB URL 설정
export TEST_DATABASE_URL="postgresql://username:password@localhost:5432/beenest_test"
```

### 2. 환경 변수 설정

테스트 실행 전 다음 환경 변수들이 설정되어야 합니다:

```bash
# .env.test 파일 생성
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/beenest_test
JWT_SECRET=test-secret-key-for-e2e-testing
JWT_REFRESH_SECRET=test-refresh-secret-key-for-e2e-testing
CORS_ORIGIN=http://localhost:3000
```

### 3. 테스트 데이터베이스 마이그레이션

```bash
# 테스트 DB 마이그레이션 실행
cd apps/api
DATABASE_URL="postgresql://postgres:password@localhost:5432/beenest_test" pnpm prisma:push
```

## 🚀 테스트 실행

### 전체 E2E 테스트 실행

```bash
cd apps/api
pnpm test:e2e
```

### 특정 테스트 파일 실행

```bash
# 인증 테스트만 실행
pnpm test:e2e auth

# 상품 관리 테스트만 실행
pnpm test:e2e products

# 주문 관리 테스트만 실행
pnpm test:e2e orders
```

### 테스트 옵션

```bash
# Watch 모드로 실행
pnpm test:e2e --watch

# 커버리지와 함께 실행
pnpm test:e2e --coverage

# Verbose 출력으로 실행
pnpm test:e2e --reporter=verbose
```

## 📊 테스트 구조

### 테스트 파일 구조

```
apps/api/test/
├── auth.e2e-spec.ts          # 인증 플로우 테스트
├── products.e2e-spec.ts      # 상품 관리 테스트
├── orders.e2e-spec.ts        # 주문 관리 테스트
├── auth-mock.e2e-spec.ts     # Mock을 사용한 테스트 예제
├── app.e2e-spec.ts           # 기본 앱 테스트
├── setup-e2e.ts              # 테스트 환경 설정
├── vitest-e2e.config.ts      # Vitest E2E 설정
└── README.md                 # 이 문서
```

### 테스트 패턴

각 E2E 테스트는 다음 패턴을 따릅니다:

1. **Setup**: 테스트 데이터베이스 초기화 및 테스트 사용자 생성
2. **테스트 실행**: API 엔드포인트 호출 및 응답 검증
3. **Cleanup**: 테스트 데이터 정리

```typescript
describe('Feature (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeEach(async () => {
    // 앱 초기화 및 테스트 데이터 설정
    await setupTestData();
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    await cleanupDatabase();
    await app.close();
  });

  describe('API Endpoint', () => {
    it('should handle normal case', async () => {
      // 테스트 로직
    });

    it('should handle error case', async () => {
      // 에러 케이스 테스트
    });
  });
});
```

## 🧪 테스트 케이스 예시

### 인증 플로우 테스트

```typescript
// 회원가입 → 로그인 → 보호된 라우트 접근 → 토큰 갱신 → 로그아웃
it('should complete full auth cycle', async () => {
  // 1. 회원가입
  const registerResponse = await request(app.getHttpServer())
    .post('/auth/register')
    .send(testUser)
    .expect(201);

  // 2. 로그인
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password })
    .expect(200);

  const { accessToken, refreshToken } = loginResponse.body.data;

  // 3. 보호된 라우트 접근
  await request(app.getHttpServer())
    .get('/auth/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  // 4. 토큰 갱신
  const refreshResponse = await request(app.getHttpServer())
    .post('/auth/refresh')
    .send({ refreshToken })
    .expect(200);

  // 5. 로그아웃
  await request(app.getHttpServer())
    .post('/auth/logout')
    .set('Authorization', `Bearer ${refreshResponse.body.data.accessToken}`)
    .expect(200);
});
```

### 상품 관리 플로우 테스트

```typescript
// 상품 생성 → 조회 → 수정 → 재고 조정 → 삭제
it('should complete product lifecycle', async () => {
  // 1. 상품 생성
  const createResponse = await request(app.getHttpServer())
    .post('/products')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(productData)
    .expect(201);

  const productId = createResponse.body.data.id;

  // 2. 상품 조회
  await request(app.getHttpServer())
    .get(`/products/${productId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  // 3. 상품 수정
  await request(app.getHttpServer())
    .patch(`/products/${productId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ productName: '수정된 이름' })
    .expect(200);

  // 4. 재고 조정
  await request(app.getHttpServer())
    .post(`/products/${productId}/stock`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ quantity: 50, type: 'in', reason: '입고' })
    .expect(200);

  // 5. 상품 삭제
  await request(app.getHttpServer())
    .delete(`/products/${productId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
});
```

## 🔧 트러블슈팅

### 자주 발생하는 문제들

#### 1. 데이터베이스 연결 오류

```
Error: Authentication failed against database server
```

**해결방법:**
- 테스트 데이터베이스가 생성되었는지 확인
- DATABASE_URL 환경변수 확인
- PostgreSQL 서버가 실행 중인지 확인

#### 2. 포트 충돌 오류

```
Error: listen EADDRINUSE: address already in use :::3001
```

**해결방법:**
- 개발 서버가 실행 중이면 중지
- 다른 포트를 사용하도록 설정

#### 3. JWT Secret 오류

```
Error: JWT secret is not defined
```

**해결방법:**
- `setup-e2e.ts`에서 환경변수 설정 확인
- `.env.test` 파일 생성

### 테스트 데이터 정리

테스트 실행 후 데이터베이스를 정리하려면:

```bash
# 테스트 데이터베이스 초기화
DATABASE_URL="postgresql://postgres:password@localhost:5432/beenest_test" pnpm prisma:reset
```

## 📈 CI/CD 통합

### GitHub Actions 예시

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: beenest_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Setup test database
        run: |
          cd apps/api
          DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beenest_test" pnpm prisma:push

      - name: Run E2E tests
        run: |
          cd apps/api
          pnpm test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/beenest_test
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
```

## 🎯 모범 사례

### 1. 테스트 독립성 보장

- 각 테스트는 독립적으로 실행 가능해야 함
- `beforeEach`에서 데이터 초기화
- `afterEach`에서 데이터 정리

### 2. 의미있는 테스트 데이터

```typescript
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: '테스트 사용자',
  companyName: '테스트 회사',
};
```

### 3. 명확한 테스트 설명

```typescript
describe('Orders (e2e)', () => {
  describe('POST /orders', () => {
    it('should create order with multiple items and calculate total correctly', async () => {
      // 테스트 로직
    });

    it('should fail when product does not exist', async () => {
      // 에러 케이스 테스트
    });
  });
});
```

### 4. 응답 구조 검증

```typescript
expect(response.body).toMatchObject({
  success: true,
  message: expect.any(String),
  data: expect.objectContaining({
    id: expect.any(String),
    // 기타 필수 필드들
  }),
});
```

## 📚 추가 자료

- [Vitest 문서](https://vitest.dev/)
- [Supertest 문서](https://github.com/visionmedia/supertest)
- [NestJS Testing 가이드](https://docs.nestjs.com/fundamentals/testing)
- [Prisma Testing 가이드](https://www.prisma.io/docs/guides/testing)

---

이 가이드를 통해 Beenest API의 E2E 테스트를 효과적으로 작성하고 실행할 수 있습니다. 질문이나 개선사항이 있다면 팀에 문의해 주세요!