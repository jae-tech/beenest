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
