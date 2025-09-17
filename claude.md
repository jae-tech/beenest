# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

소규모 창업자들을 위한 거래처 및 재고 관리 시스템을 개발하는 프로젝트입니다. 스타트업과 소상공인이 거래처 정보와 재고 현황을 쉽고 효율적으로 관리할 수 있도록 지원하는 웹 애플리케이션입니다.

### 주요 기능

- 거래처 정보 관리 (등록, 수정, 조회)
- 재고 현황 관리 및 추적
- 거래처별 주문/구매 이력 관리
- 재고 입출고 관리 및 이력 추적
- 통합 대시보드 및 리포팅

### 기술 스택

Next.js 기반의 타입세이프한 웹 애플리케이션으로, Turborepo 모노레포 구조와 TypeScript를 사용하여 개발됩니다.

## Development Commands

### Core Development Tasks

- **Start development server**: `pnpm dev`
  - Runs all apps in development mode
  - Beenest app: http://localhost:5173
  - Api app: http://localhost:3001
- **Start specific app**: `pnpm dev --filter=beenest` or `pnpm dev --filter=api`
  - Uses Next.js dev server with Turbopack for fast builds
- **Build for production**: `pnpm build`
  - Creates optimized production bundles for all apps
- **Build specific app**: `pnpm build --filter=beenest`

### Code Quality

- **Lint all**: `pnpm lint`
  - Uses ESLint with shared configuration across all packages
- **Lint specific app**: `pnpm lint --filter=beenest`
- **Type checking**: `pnpm check-types`
  - Runs TypeScript compiler in type-check only mode for all packages
- **Format code**: `pnpm format`
  - Uses Prettier to format all TypeScript, TSX, and Markdown files

### Package Management

- **Install dependencies**: `pnpm install`
- **Add dependency to workspace**: `pnpm add [package] -w`
- **Add dependency to specific app**: `pnpm add [package] --filter=beenest`

## Architecture

### Monorepo Structure

- **Turborepo**: Uses Turborepo for build orchestration, caching, and task execution
- **Package Manager**: Uses pnpm with workspaces for efficient dependency management
- **Apps Location**: Applications are in `apps/` directory
- **Packages Location**: Shared packages are in `packages/` directory
- **Current Apps**:
  - `beenest` - main Next.js application for customer/inventory management
  - `api` - documentation site

### Applications

#### beenest Application (`apps/beenest`)

- **Framework**: Next.js 15 with React 19
- **Router**: Next.js App Router for file-based routing
- **Port**: http://localhost:3000
- **Dependencies**: Uses shared packages from workspace

#### Documentation (`apps/api`)

- **Framework**: Next.js 15 with React 19
- **Port**: http://localhost:3001
- **Purpose**: Project documentation and guides

### Shared Packages (`packages/`)

- **UI Package** (`@beenest/ui`): Shared React components and UI library
- **ESLint Config** (`@beenest/eslint-config`): Shared ESLint configuration
- **TypeScript Config** (`@beenest/typescript-config`): Shared TypeScript configuration

### Technology Stack

- **Frontend**: React 19, Next.js 15
- **Build Tool**: Next.js with Turbopack for fast development builds
- **Routing**: Next.js App Router for file-based routing
- **Styling**: Tailwind CSS + shared UI components
- **TypeScript**: Strict configuration with modern ES2022 target
- **Linting**: ESLint with shared configuration across packages
- **Formatting**: Prettier for consistent code formatting

### Configuration Files

- **Turborepo Config**: `turbo.json` - defines build tasks, caching, and dependencies
- **TypeScript**: `tsconfig.json` (base) + package-specific configs
- **Package Management**: `pnpm-workspace.yaml` - defines workspace structure
- **Next.js**: Each app has its own `next.config.js`

## Development Notes

### Next.js Application Structure

- Server-Side Rendering (SSR) with Next.js App Router
- File-based routing with React Server Components
- Build produces optimized client and server bundles

### Styling Approach

- Tailwind CSS is the base styling solution
- Shared UI components from `@beenest/components` package
- Component reusability across different apps
- Consistent design system through shared packages

### Turborepo Benefits

- **Incremental Builds**: Only rebuilds changed packages
- **Remote Caching**: Shares build artifacts across team
- **Parallel Execution**: Runs tasks across packages simultaneously
- **Dependency Management**: Automatically handles build dependencies

### Code Organization

- **App Router**: Next.js file-based routing with `app/` directory
- **Shared Components**: Reusable UI components in `@beenest/components`
- **Config Sharing**: ESLint and TypeScript configs shared across packages
- **Types**: TypeScript definitions for type safety
- **Workspaces**: pnpm workspaces for efficient dependency management

### Package Management

- Uses pnpm for improved performance and disk usage
- Workspaces configured for monorepo structure
- Dependencies managed at both root and app levels
- **Always keep packages up-to-date**: Regularly update pnpm and all dependencies to latest stable versions
- **Package update commands**:
  - `pnpm update` - Update all dependencies
  - `pnpm update --latest` - Update to latest versions (including breaking changes)
  - `pnpm outdated` - Check for outdated packages

## Development Guidelines & AI Instructions

### Project Context

This is a **customer and inventory management system for small business owners**. When implementing features:

- Prioritize simplicity and usability for non-technical users
- Focus on core business workflows (customer data, inventory tracking, order management)
- Ensure mobile-responsive design for on-the-go business management

### Technical Requirements

- **Type Safety First**: Always use TypeScript with strict mode
- **Component Architecture**: Use shared `@beenest/components` components, extend with custom business logic
- **State Management**: Keep state close to components, use React Server Components when possible
- **API Design**: Design APIs thinking about real-time inventory updates and customer data consistency

### Code Standards

- **Import Paths**: Use workspace references for shared packages (`@beenest/components`, `@beenest/eslint-config`)
- **Component Structure**: Shared components in `@beenest/components`, app-specific components in respective apps
- **Error Handling**: Implement comprehensive error boundaries and loading states with Next.js
- **Performance**: Optimize with Next.js App Router, Server Components, and Turbopack

### Communication Guidelines

- **Language**: Respond in Korean (한국어) by default
- **Style**: Keep responses concise and actionable
- **Focus**: Address the specific task without unnecessary explanations
- **Package Management**: Always suggest latest stable versions and keep dependencies updated
- **Compact Mode**: When left context is 50% or lower, automatically enable /compact mode

### Business Logic Priorities

1. **Customer Management**: Registration, profiles, contact history
2. **Inventory Tracking**: Real-time stock levels, low-stock alerts
3. **Order Processing**: Customer orders, inventory updates, fulfillment
4. **Reporting**: Simple dashboards for business insights

## Git Commit Convention

### Commit Message Guidelines

- **Language**: 한국어로 커밋 메시지를 작성합니다
- **Format**: `타입: 간단한 설명` 형식을 따릅니다
- **Types**:
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `api`: 문서 수정
  - `style`: 코드 스타일 변경 (포매팅, 세미콜론 등)
  - `refactor`: 코드 리팩터링
  - `test`: 테스트 코드 추가/수정
  - `chore`: 빌드 프로세스, 패키지 설정 변경

### Examples

```
feat: 거래처 등록 기능 추가
fix: 재고 조회 시 오류 수정
api: API 문서 업데이트
refactor: 주문 처리 로직 개선
chore: Turborepo 환경 구성 및 패키지 업데이트
```

### Detailed Description

- 필요시 본문에 변경사항에 대한 자세한 설명을 한글로 작성
- 여러 변경사항이 있을 경우 리스트로 정리
- 주요 기술적 결정사항이나 아키텍처 변경사항 설명

## Recent Work Completed

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

## Backend Architecture (MVP Design)

### MVP 백엔드 설계 개요

소규모 창업자들을 위한 거래처 및 재고 관리 시스템의 백엔드는 단순하면서도 확장 가능한 구조로 설계됩니다. MVP 단계에서는 핵심 비즈니스 로직에 집중하고, 추후 확장성을 고려한 아키텍처를 구성합니다.

### 핵심 기능 정의

#### 1. 인증 시스템
- 사용자 로그인/회원가입 (JWT 기반)
- 사용자 세션 관리
- 비밀번호 암호화 (bcrypt)

#### 2. 대시보드 데이터
- 매출, 주문, 재고, 고객 통계 API
- 차트용 시계열 데이터 제공
- 실시간 알림 (재고 부족, 주문 업데이트)

#### 3. 재고 관리
- 상품 CRUD 작업
- 재고 현황 실시간 추적
- 재고 입출고 이력 관리
- 자동 재고 알림 (품절, 부족 임계값)

#### 4. 공급업체 관리
- 공급업체 정보 CRUD
- 공급업체별 성과 통계
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

suppliers (공급업체)
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
POST /api/auth/register     # 회원가입
POST /api/auth/login        # 로그인
POST /api/auth/logout       # 로그아웃
GET  /api/auth/me          # 현재 사용자 정보
```

#### 대시보드 API
```
GET /api/dashboard/stats    # 전체 통계 (매출, 주문수, 재고값, 공급업체수)
GET /api/dashboard/charts   # 차트 데이터 (월별 매출, 재고 현황)
GET /api/dashboard/alerts   # 알림 데이터 (재고 부족, 주문 상태)
```

#### 상품 관리 API
```
GET    /api/products           # 상품 목록 (페이징, 검색, 필터)
POST   /api/products           # 상품 등록
GET    /api/products/:id       # 상품 상세 정보
PUT    /api/products/:id       # 상품 정보 수정
DELETE /api/products/:id       # 상품 삭제
POST   /api/products/:id/stock # 재고 수동 조정
GET    /api/products/low-stock # 재고 부족 상품 목록
```

#### 공급업체 API
```
GET    /api/suppliers         # 공급업체 목록
POST   /api/suppliers         # 공급업체 등록
GET    /api/suppliers/:id     # 공급업체 상세 정보
PUT    /api/suppliers/:id     # 공급업체 정보 수정
DELETE /api/suppliers/:id     # 공급업체 삭제
GET    /api/suppliers/:id/stats # 공급업체별 통계
```

#### 주문 관리 API
```
GET    /api/orders           # 주문 목록 (상태별 필터, 페이징)
POST   /api/orders           # 새 주문 생성
GET    /api/orders/:id       # 주문 상세 정보
PUT    /api/orders/:id       # 주문 정보 수정
DELETE /api/orders/:id       # 주문 삭제
PUT    /api/orders/:id/status # 주문 상태 변경
```

### 기술 스택 (추천)

#### 백엔드 프레임워크
- **Node.js + Express.js + TypeScript**
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
1. 공급업체 관리 API
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
