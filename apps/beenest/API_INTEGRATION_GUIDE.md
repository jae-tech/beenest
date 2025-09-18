# API 통합 가이드

이 문서는 Beenest 프론트엔드와 백엔드 API 간의 실제 연동 설정과 테스트 방법을 설명합니다.

## 🚀 완료된 작업

### 1. API 클라이언트 설정 ✅
- **파일**: `src/lib/api-client.ts`
- **기능**:
  - Axios 기반 HTTP 클라이언트
  - JWT 토큰 자동 포함 인터셉터
  - 401 에러 시 자동 로그아웃 처리
  - 네트워크 에러 표준화 처리
  - 토큰 만료 검증

### 2. 공통 타입 정의 ✅
- **파일**: `src/types/api.ts`
- **기능**:
  - 백엔드 API와 동기화된 타입 정의
  - 페이지네이션 응답 타입
  - 에러 응답 표준화
  - CRUD 작업을 위한 요청/응답 타입

### 3. 인증 시스템 API 연동 ✅
- **파일**: `src/app/store/authStore.ts`, `src/features/auth/hooks/useAuth.ts`
- **기능**:
  - 실제 로그인/회원가입 API 호출
  - JWT 토큰 관리 (localStorage)
  - 토큰 자동 갱신
  - 인증 상태 확인

### 4. 상품 관리 API 연동 ✅
- **파일**: `src/hooks/useProducts.ts`, `src/services/products.service.ts`
- **기능**:
  - TanStack Query 기반 상품 CRUD
  - 실시간 재고 관리
  - 재고 부족 알림
  - 상품 검색 및 필터링

### 5. 공급업체 API 연동 ✅
- **파일**: `src/hooks/useSuppliers.ts`, `src/services/suppliers.service.ts`
- **기능**:
  - 공급업체 CRUD 작업
  - 공급업체별 통계
  - 검색 및 자동완성

### 6. 대시보드 실시간 데이터 ✅
- **파일**: `src/features/dashboard/hooks/useDashboard.ts`, `src/services/dashboard.service.ts`
- **기능**:
  - 실시간 비즈니스 메트릭
  - 자동 새로고침 (5분 간격)
  - 차트 데이터 연동

### 7. 에러 처리 및 토스트 시스템 ✅
- **파일**: `src/lib/toast.ts`, `src/app/providers/AppProviders.tsx`
- **기능**:
  - react-hot-toast 통합
  - API 에러 자동 표시
  - 성공 메시지 알림
  - 로딩 상태 표시

### 8. CORS 및 개발 환경 설정 ✅
- **파일**: `vite.config.ts`, `.env`
- **기능**:
  - Vite 프록시 설정 (`/api` → `http://localhost:3001`)
  - 환경별 API URL 관리
  - CORS 문제 해결

## 🔧 환경 설정

### 환경 변수 (.env)
```env
# API Configuration
VITE_API_URL=/api

# Application Configuration
VITE_APP_NAME=Beenest

# Development Configuration
NODE_ENV=development

# Backend Configuration (프록시 대상)
VITE_BACKEND_URL=http://localhost:3001
```

### Vite 프록시 설정
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## 🧪 테스트 방법

### 1. 백엔드 서버 실행
```bash
# NestJS 백엔드 서버 실행 (포트 3001)
cd apps/api
npm run dev
```

### 2. 프론트엔드 개발 서버 실행
```bash
# React 프론트엔드 서버 실행 (포트 5173)
cd apps/beenest
pnpm dev
```

### 3. API 연동 확인
- 브라우저에서 `http://localhost:5173` 접속
- 개발자 도구 Network 탭에서 API 호출 확인
- Console에서 "API Client initialized with baseURL: /api" 메시지 확인

### 4. 기능별 테스트 체크리스트

#### 인증 테스트
- [ ] 로그인 페이지에서 실제 API 호출
- [ ] JWT 토큰 localStorage 저장 확인
- [ ] 토큰 만료 시 자동 로그아웃
- [ ] 보호된 페이지 접근 제어

#### 상품 관리 테스트
- [ ] 상품 목록 로딩 (GET /api/products)
- [ ] 상품 등록 (POST /api/products)
- [ ] 상품 수정 (PUT /api/products/:id)
- [ ] 상품 삭제 (DELETE /api/products/:id)
- [ ] 재고 조정 (POST /api/products/:id/stock)

#### 공급업체 테스트
- [ ] 공급업체 목록 (GET /api/suppliers)
- [ ] 공급업체 등록 (POST /api/suppliers)
- [ ] 공급업체 검색 (GET /api/suppliers/search)

#### 대시보드 테스트
- [ ] 통계 데이터 로딩 (GET /api/dashboard/stats)
- [ ] 차트 데이터 로딩 (GET /api/dashboard/charts)
- [ ] 자동 새로고침 동작

## 🐛 에러 처리

### 일반적인 에러 상황
1. **네트워크 에러**: "네트워크 연결을 확인해주세요" 토스트 표시
2. **401 인증 에러**: "로그인이 필요합니다" 토스트 후 로그인 페이지 리다이렉트
3. **서버 에러**: 백엔드에서 전달한 에러 메시지 표시
4. **유효성 검사 에러**: 폼 필드별 에러 메시지 표시

### 에러 로깅
- API 에러는 자동으로 토스트로 표시
- 콘솔에서 자세한 에러 정보 확인 가능
- Vite 프록시 로그로 API 호출 상태 모니터링

## 📝 API 엔드포인트 명세

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 현재 사용자 정보

### 상품 API
- `GET /api/products` - 상품 목록 (페이징, 검색, 필터)
- `POST /api/products` - 상품 등록
- `GET /api/products/:id` - 상품 상세
- `PUT /api/products/:id` - 상품 수정
- `DELETE /api/products/:id` - 상품 삭제
- `POST /api/products/:id/stock` - 재고 조정
- `GET /api/products/low-stock` - 재고 부족 상품

### 공급업체 API
- `GET /api/suppliers` - 공급업체 목록
- `POST /api/suppliers` - 공급업체 등록
- `GET /api/suppliers/:id` - 공급업체 상세
- `PUT /api/suppliers/:id` - 공급업체 수정
- `DELETE /api/suppliers/:id` - 공급업체 삭제
- `GET /api/suppliers/search` - 공급업체 검색

### 대시보드 API
- `GET /api/dashboard/stats` - 대시보드 통계
- `GET /api/dashboard/charts` - 차트 데이터
- `GET /api/dashboard/alerts` - 알림 데이터

## 🔄 실시간 기능

### TanStack Query 캐싱
- 상품 목록: 5분 캐시
- 대시보드 통계: 5분 자동 새로고침
- 알림 데이터: 2분 자동 새로고침
- 검색 결과: 30초 캐시

### 자동 무효화
- 상품 생성/수정/삭제 시 관련 쿼리 자동 무효화
- 대시보드 통계 자동 업데이트
- 실시간 토스트 알림

## 🚨 주의사항

1. **백엔드 서버 필수**: API 연동을 위해 백엔드 서버가 먼저 실행되어야 함
2. **CORS 설정**: 백엔드에서 `http://localhost:5173` 허용 필요
3. **JWT 토큰**: 백엔드와 동일한 토큰 형식 및 만료 시간 설정
4. **에러 형식**: 백엔드 에러 응답이 `ApiResponse` 형식과 일치해야 함

## 📚 추가 참고 자료

- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Axios 문서](https://axios-http.com/)
- [React Hot Toast 문서](https://react-hot-toast.com/)
- [Vite 프록시 설정](https://vitejs.dev/config/server-options.html#server-proxy)