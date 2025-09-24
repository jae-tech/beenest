# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업을 할 때 참조하는 가이드입니다.

## 프로젝트 개요

소규모 창업자들을 위한 재고 및 거래처 관리 시스템을 개발하는 프로젝트입니다. 스타트업과 소상공인이 재고 정보와 거래처 현황을 쉽고 효율적으로 관리할 수 있도록 지원하는 웹 애플리케이션입니다.

### 주요 기능

- 재고 정보 관리 (등록, 수정, 조회)
- 재고 현황 관리 및 추적
- 거래처별 주문/구매 이력 관리
- 재고 입출고 관리 및 이력 추적
- 통합 대시보드 및 리포팅

### 기술 스택

Vite 기반의 타입세이프한 웹 애플리케이션으로, Turborepo 모노레포 구조와 TypeScript를 사용하여 개발됩니다.

## 개발 명령어

### 핵심 개발 작업

- **개발 서버 시작**: `pnpm dev`
  - 모든 앱을 개발 모드로 실행
  - Beenest 앱: http://localhost:5173
  - Api 앱: http://localhost:3001
- **특정 앱 시작**: `pnpm dev --filter=beenest` 또는 `pnpm dev --filter=api`
  - 빠른 빌드를 위해 Vite 개발 서버 사용
- **프로덕션 빌드**: `pnpm build`
  - 모든 앱의 최적화된 프로덕션 번들 생성
- **특정 앱 빌드**: `pnpm build --filter=beenest`

### 코드 품질

- **전체 린트**: `pnpm lint`
  - 모든 패키지에서 공유 설정으로 ESLint 사용
- **특정 앱 린트**: `pnpm lint --filter=beenest`
- **타입 체크**: `pnpm check-types`
  - 모든 패키지에서 타입 체크 전용 모드로 TypeScript 컴파일러 실행
- **코드 포맷**: `pnpm format`
  - Prettier를 사용하여 모든 TypeScript, TSX, Markdown 파일 포맷

### 패키지 관리

- **의존성 설치**: `pnpm install`
- **워크스페이스 의존성 추가**: `pnpm add [package] -w`
- **특정 앱 의존성 추가**: `pnpm add [package] --filter=beenest`

## 아키텍처

### 모노레포 구조

- **Turborepo**: 빌드 오케스트레이션, 캐싱, 작업 실행을 위해 Turborepo 사용
- **패키지 매니저**: 효율적인 의존성 관리를 위해 pnpm workspaces 사용
- **앱 위치**: 애플리케이션은 `apps/` 디렉토리에 위치
- **패키지 위치**: 공유 패키지는 `packages/` 디렉토리에 위치
- **현재 앱들**:
  - `beenest` - 재고/거래처 관리를 위한 메인 Vite 애플리케이션
  - `api` - 문서 사이트

### 애플리케이션

#### beenest 애플리케이션 (`apps/beenest`)

- **프레임워크**: React + Vite + TypeScript
- **라우터**: TanStack Router로 파일 기반 라우팅
- **포트**: http://localhost:5173
- **의존성**: 워크스페이스의 공유 패키지 사용

#### 문서 (`apps/api`)

- **프레임워크**: NestJS + Fastify
- **포트**: http://localhost:3001
- **목적**: 프로젝트 문서 및 가이드

### 공유 패키지 (`packages/`)

- **UI 패키지** (`@beenest/ui`): 공유 React 컴포넌트 및 UI 라이브러리
- **ESLint 설정** (`@beenest/eslint-config`): 공유 ESLint 설정
- **TypeScript 설정** (`@beenest/typescript-config`): 공유 TypeScript 설정

### 기술 스택

- **프론트엔드**: React 19, Vite
- **빌드 도구**: 빠른 개발 빌드를 위한 Vite
- **라우팅**: TanStack Router로 파일 기반 라우팅
- **스타일링**: Tailwind CSS + 공유 UI 컴포넌트
- **TypeScript**: 현대적인 ES2022 타겟으로 strict 설정
- **린팅**: 패키지 간 공유 설정으로 ESLint
- **포맷팅**: 일관된 코드 포맷을 위한 Prettier

### 설정 파일

- **Turborepo 설정**: `turbo.json` - 빌드 작업, 캐싱, 의존성 정의
- **TypeScript**: `tsconfig.json` (기본) + 패키지별 설정
- **패키지 관리**: `pnpm-workspace.yaml` - 워크스페이스 구조 정의
- **Vite**: 각 앱마다 자체 `vite.config.js`

## 개발 노트

### Vite 애플리케이션 구조

- TanStack Router를 사용한 클라이언트 사이드 렌더링 (CSR)
- 파일 기반 라우팅
- 빌드 시 최적화된 클라이언트 번들 생성

### 스타일링 접근법

- Tailwind CSS가 기본 스타일링 솔루션
- `@beenest/components` 패키지의 공유 UI 컴포넌트
- 여러 앱 간 컴포넌트 재사용성
- 공유 패키지를 통한 일관된 디자인 시스템

### Turborepo 장점

- **증분 빌드**: 변경된 패키지만 재빌드
- **원격 캐싱**: 팀 간 빌드 아티팩트 공유
- **병렬 실행**: 패키지 간 작업을 동시에 실행
- **의존성 관리**: 빌드 의존성 자동 처리

### 코드 구성

- **파일 기반 라우팅**: `src/routes/` 디렉토리로 TanStack Router 라우팅
- **공유 컴포넌트**: `@beenest/components`의 재사용 가능한 UI 컴포넌트
- **설정 공유**: 패키지 간 ESLint 및 TypeScript 설정 공유
- **타입**: 타입 안전성을 위한 TypeScript 정의
- **워크스페이스**: 효율적인 의존성 관리를 위한 pnpm 워크스페이스

### 패키지 관리

- 향상된 성능과 디스크 사용량을 위해 pnpm 사용
- 모노레포 구조를 위한 워크스페이스 설정
- 루트 및 앱 레벨에서 의존성 관리
- **패키지를 항상 최신으로 유지**: pnpm과 모든 의존성을 정기적으로 최신 안정 버전으로 업데이트
- **패키지 업데이트 명령어**:
  - `pnpm update` - 모든 의존성 업데이트
  - `pnpm update --latest` - 최신 버전으로 업데이트 (호환성 깨짐 포함)
  - `pnpm outdated` - 오래된 패키지 확인

## 개발 가이드라인 및 AI 지침

### 프로젝트 컨텍스트

이것은 **소규모 사업자를 위한 재고 및 거래처 관리 시스템**입니다. 기능 구현 시:

- 비기술적 사용자를 위한 단순함과 사용성 우선
- 핵심 비즈니스 워크플로우에 집중 (재고 데이터, 재고 추적, 주문 관리)
- 이동 중 비즈니스 관리를 위한 모바일 반응형 디자인 보장

### 기술 요구사항

- **타입 안전성 우선**: 항상 strict 모드로 TypeScript 사용
- **컴포넌트 아키텍처**: 공유 `@beenest/components` 컴포넌트 사용, 커스텀 비즈니스 로직으로 확장
- **상태 관리**: 컴포넌트와 가까운 곳에 상태 유지, 가능하면 TanStack Query 사용
- **API 설계**: 실시간 재고 업데이트와 데이터 일관성을 고려한 API 설계

### 코드 표준

- **Import 경로**: 공유 패키지에 워크스페이스 참조 사용 (`@beenest/components`, `@beenest/eslint-config`)
- **컴포넌트 구조**: `@beenest/components`의 공유 컴포넌트, 각 앱의 앱별 컴포넌트
- **에러 처리**: Vite와 함께 포괄적인 에러 바운더리 및 로딩 상태 구현
- **성능**: TanStack Router와 Vite로 최적화

### 소통 가이드라인

- **언어**: 기본적으로 한국어로 응답
- **스타일**: 간결하고 실행 가능한 답변 유지
- **집중**: 불필요한 설명 없이 구체적인 작업에 집중
- **패키지 관리**: 항상 최신 안정 버전 제안 및 의존성 최신 상태 유지
- **컴팩트 모드**: 좌측 컨텍스트가 50% 이하일 때 자동으로 /compact 모드 활성화

### 비즈니스 로직 우선순위

1. **재고 관리**: 등록, 프로필, 연락 이력
2. **재고 추적**: 실시간 재고 수준, 재고 부족 알림
3. **주문 처리**: 재고 주문, 재고 업데이트, 이행
4. **리포팅**: 비즈니스 인사이트를 위한 간단한 대시보드

## Git 커밋 규칙

### 커밋 메시지 가이드라인

- **언어**: 한국어로 커밋 메시지를 작성합니다
- **형식**: `타입: 간단한 설명` 형식을 따릅니다
- **타입**:
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `docs`: 문서 수정
  - `style`: 코드 스타일 변경 (포매팅, 세미콜론 등)
  - `refactor`: 코드 리팩터링
  - `test`: 테스트 코드 추가/수정
  - `chore`: 빌드 프로세스, 패키지 설정 변경

### 예시

```
feat: 거래처 등록 기능 추가
fix: 재고 조회 시 오류 수정
docs: API 문서 업데이트
refactor: 주문 처리 로직 개선
chore: Turborepo 환경 구성 및 패키지 업데이트
```

### 상세 설명

- 필요시 본문에 변경사항에 대한 자세한 설명을 한글로 작성
- 여러 변경사항이 있을 경우 리스트로 정리
- 주요 기술적 결정사항이나 아키텍처 변경사항 설명

## 최근 완료된 작업

### TailwindCSS v4 + Vite 설정 완료

- **TailwindCSS v4**: `@tailwindcss/vite` 플러그인 사용하여 Vite와 통합
- **설정 파일**:
  - `vite.config.ts`: `@tailwindcss/vite` 플러그인 추가
  - `src/index.css`: `@import "tailwindcss";` 방식 사용
  - `tailwind.config.js`: 컴포넌트 패키지 설정 임포트

### 모노레포 컴포넌트 패키지 구조 개선

- **@beenest/components**: 중앙화된 UI 컴포넌트 라이브러리
- **패키지 빌드**: tsup을 사용한 ESM/CJS 듀얼 빌드
- **exports 설정**: package.json에서 proper exports 필드 설정
- **모듈 해석**: workspace dependencies 제대로 작동

### 주요 해결 사항

- **TailwindCSS v4 호환성**: shadcn/ui 컴포넌트와 함께 작동
- **Vite 캐시 문제**: node_modules/.vite 캐시 정리로 해결
- **모듈 해석 문제**: 컴포넌트 패키지 빌드 후 해결
- **CSS 변수 설정**: shadcn/ui에 필요한 CSS 커스텀 속성 추가

### 현재 작동 중인 설정

```bash
# beenest 앱 개발 서버 시작
cd apps/beenest && pnpm dev

# 컴포넌트 패키지 빌드
pnpm build --filter=@beenest/components
```

### 아키텍처 변경점

- **스타일링**: TailwindCSS v4 + @tailwindcss/vite 플러그인
- **컴포넌트 구조**: 중앙화된 @beenest/components 패키지
- **빌드 시스템**: tsup 기반 컴포넌트 빌드, Vite 기반 앱 빌드
- **개발 환경**: http://localhost:5173 (Vite 개발 서버)

## 백엔드 아키텍처 (MVP 설계)

### MVP 백엔드 설계 개요

소규모 창업자들을 위한 재고 및 거래처 관리 시스템의 백엔드는 단순하면서도 확장 가능한 구조로 설계됩니다. MVP 단계에서는 핵심 비즈니스 로직에 집중하고, 추후 확장성을 고려한 아키텍처를 구성합니다.

### 핵심 기능 정의

#### 1. 인증 시스템

- 사용자 로그인/회원가입 (JWT 기반)
- 사용자 세션 관리
- 비밀번호 암호화 (bcrypt)

#### 2. 대시보드 데이터

- 매출, 주문, 재고, 거래처 통계 API
- 차트용 시계열 데이터 제공
- 실시간 알림 (재고 부족, 주문 업데이트)

#### 3. 재고 관리

- 상품 CRUD 작업
- 재고 현황 실시간 추적
- 재고 입출고 이력 관리
- 자동 재고 알림 (품절, 부족 임계값)

#### 4. 거래처 관리

- 거래처 정보 CRUD
- 거래처별 성과 통계
- 연락처 및 평가 시스템

#### 5. 주문 관리

- 주문 생성, 수정, 삭제
- 주문 상태 관리 (대기, 확인, 배송, 완료, 취소)
- 주문별 재고 자동 차감

### 데이터베이스 스키마

```sql
-- 핵심 테이블 구조
users (사용자)
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── password_hash (VARCHAR)
├── name, company_name
└── created_at, updated_at

suppliers (거래처)
├── id (UUID, PK)
├── user_id (FK)
├── name, contact, email, phone
├── location, status, rating
└── created_at, updated_at

products (상품)
├── id (UUID, PK)
├── user_id, supplier_id, category_id (FK)
├── name, sku (UNIQUE), description
├── price, cost_price, stock_quantity
├── min_stock_level, image_url, status
└── created_at, updated_at

orders (주문)
├── id (UUID, PK)
├── user_id, supplier_id (FK)
├── order_number (UNIQUE), status
├── order_date, expected_delivery_date
├── total_amount, notes
└── created_at, updated_at

stock_movements (재고 이동)
├── id (UUID, PK)
├── product_id (FK)
├── movement_type (in/out/adjustment)
├── quantity, previous_stock, new_stock
├── reason, reference_id, reference_type
└── created_at
```

### API 엔드포인트 설계

#### 인증 API

```
POST /auth/register     # 회원가입
POST /auth/login        # 로그인
POST /auth/logout       # 로그아웃
GET  /auth/me          # 현재 사용자 정보
```

#### 대시보드 API

```
GET /dashboard/stats    # 전체 통계 (매출, 주문수, 재고값, 거래처수)
GET /dashboard/charts   # 차트 데이터 (월별 매출, 재고 현황)
GET /dashboard/alerts   # 알림 데이터 (재고 부족, 주문 상태)
```

#### 상품 관리 API

```
GET    /products           # 상품 목록 (페이징, 검색, 필터)
POST   /products           # 상품 등록
GET    /products/:id       # 상품 상세 정보
PUT    /products/:id       # 상품 정보 수정
DELETE /products/:id       # 상품 삭제
POST   /products/:id/stock # 재고 수동 조정
GET    /products/low-stock # 재고 부족 상품 목록
```

#### 거래처 API

```
GET    /suppliers         # 거래처 목록
POST   /suppliers         # 거래처 등록
GET    /suppliers/:id     # 거래처 상세 정보
PUT    /suppliers/:id     # 거래처 정보 수정
DELETE /suppliers/:id     # 거래처 삭제
GET    /suppliers/:id/stats # 거래처별 통계
```

#### 주문 관리 API

```
GET    /orders           # 주문 목록 (상태별 필터, 페이징)
POST   /orders           # 새 주문 생성
GET    /orders/:id       # 주문 상세 정보
PUT    /orders/:id       # 주문 정보 수정
DELETE /orders/:id       # 주문 삭제
PUT    /orders/:id/status # 주문 상태 변경
```

### 기술 스택 (추천)

#### 백엔드 프레임워크

- **Node.js + NestJS + TypeScript**
  - 프론트엔드와 일관된 개발 환경
  - 빠른 프로토타이핑 및 MVP 개발
  - 풍부한 생태계와 라이브러리

#### 데이터베이스

- **PostgreSQL**: 관계형 데이터, ACID 보장, 복잡한 쿼리 지원
- **Prisma ORM**: TypeScript 네이티브, 스키마 마이그레이션, 타입 안전성

#### 인증 및 보안

- **JWT (jsonwebtoken)**: 무상태 토큰 기반 인증
- **bcrypt**: 비밀번호 해싱
- **helmet**: HTTP 보안 헤더
- **cors**: Cross-Origin 요청 관리

#### 개발 도구

- **Nodemon**: 개발 시 자동 재시작
- **Jest + Supertest**: API 테스트
- **ESLint + Prettier**: 코드 품질 및 포매팅
- **joi** 또는 **zod**: 요청 데이터 검증

#### 배포 및 인프라

- **Docker**: 컨테이너화로 일관된 배포 환경
- **Railway** 또는 **Vercel**: 간단한 배포 및 호스팅
- **Supabase** 또는 **Neon**: PostgreSQL 클라우드 서비스

### 프로젝트 구조

```
apps/api/                   # 백엔드 애플리케이션
├── src/
│   ├── controllers/        # 비즈니스 로직 처리
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── suppliers.controller.ts
│   │   └── orders.controller.ts
│   ├── middleware/         # 미들웨어 (인증, 검증 등)
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/            # 데이터 모델 (Prisma)
│   │   └── schema.prisma
│   ├── routes/            # API 라우트 정의
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   ├── suppliers.routes.ts
│   │   └── orders.routes.ts
│   ├── services/          # 비즈니스 서비스 로직
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   └── dashboard.service.ts
│   ├── utils/             # 유틸리티 함수
│   │   ├── jwt.utils.ts
│   │   ├── validation.utils.ts
│   │   └── response.utils.ts
│   ├── types/             # TypeScript 타입 정의
│   │   └── index.ts
│   └── app.ts             # Express 앱 설정
├── tests/                 # 테스트 파일
├── prisma/               # 데이터베이스 스키마 및 마이그레이션
├── docker/               # Docker 설정
├── package.json
└── tsconfig.json
```

### MVP 개발 로드맵

#### Phase 1 (1-2주): 기반 인프라

1. Express + TypeScript 프로젝트 셋업
2. PostgreSQL + Prisma 데이터베이스 연결
3. JWT 기반 인증 시스템 구현
4. 기본 미들웨어 (에러 처리, CORS, 로깅) 설정

#### Phase 2 (1주): 핵심 기능

1. 상품 관리 API 구현 (CRUD)
2. 재고 이동 로직 및 이력 관리
3. 기본 대시보드 통계 API

#### Phase 3 (1주): 확장 기능

1. 거래처 관리 API
2. 주문 관리 시스템 (기본)
3. 재고 알림 로직

#### Phase 4 (1주): 품질 향상

1. 종합적인 에러 처리 및 검증
2. 기본 테스트 케이스 작성
3. Docker 컨테이너화 및 배포 설정

### 데이터베이스 마이그레이션 전략

- **Prisma Migrate**: 스키마 변경사항 추적 및 자동 마이그레이션
- **Seed 데이터**: 개발 및 테스트용 샘플 데이터 자동 생성
- **백업 전략**: 프로덕션 데이터 정기 백업 및 복구 계획

### API 응답 형식

```typescript
// 성공 응답
{
  success: true,
  data: any,
  message?: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// 에러 응답
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 보안 고려사항

1. **입력 검증**: 모든 API 요청 데이터 검증
2. **SQL 인젝션 방지**: Prisma ORM 사용으로 자동 방지
3. **XSS 방지**: 입력 데이터 sanitization
4. **Rate Limiting**: API 호출 빈도 제한
5. **HTTPS 강제**: 프로덕션 환경에서 SSL/TLS 사용
