#!/usr/bin/env node

/**
 * BEENEST 시스템 수동 E2E 테스트 스크립트
 * 인증 없이 프론트엔드 기능들의 기본 동작을 테스트합니다.
 */

import { execSync } from 'child_process';
import fetch from 'node-fetch';

const FRONTEND_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001';

console.log('🧪 BEENEST E2E 테스트 시작\n');

// 1. 서버 상태 확인
async function checkServers() {
  console.log('1. 서버 상태 확인');

  try {
    const frontendResponse = await fetch(FRONTEND_URL);
    console.log(`✅ 프론트엔드 서버: ${frontendResponse.status} ${frontendResponse.statusText}`);
  } catch (error) {
    console.log(`❌ 프론트엔드 서버 연결 실패: ${error.message}`);
    return false;
  }

  try {
    const apiResponse = await fetch(`${API_URL}/docs`);
    console.log(`✅ API 서버: ${apiResponse.status} ${apiResponse.statusText}`);
  } catch (error) {
    console.log(`❌ API 서버 연결 실패: ${error.message}`);
    return false;
  }

  console.log('');
  return true;
}

// 2. 프론트엔드 라우팅 테스트
async function checkRoutes() {
  console.log('2. 프론트엔드 라우팅 확인');

  const routes = [
    '/',
    '/dashboard',
    '/products',
    '/suppliers',
    '/transactions',
    '/inventory',
    '/reports',
    '/settings'
  ];

  for (const route of routes) {
    try {
      const response = await fetch(`${FRONTEND_URL}${route}`);
      if (response.status === 200) {
        console.log(`✅ ${route}: 정상 로딩`);
      } else {
        console.log(`⚠️  ${route}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${route}: 연결 실패`);
    }
  }

  console.log('');
}

// 3. API 엔드포인트 구조 확인
async function checkAPIEndpoints() {
  console.log('3. API 엔드포인트 구조 확인');

  const endpoints = [
    { method: 'GET', path: '/products', description: '상품 목록' },
    { method: 'GET', path: '/suppliers', description: '공급업체 목록' },
    { method: 'GET', path: '/transactions', description: '거래 목록' },
    { method: 'GET', path: '/inventory', description: '재고 현황' },
    { method: 'GET', path: '/dashboard/stats', description: '대시보드 통계' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 401) {
        console.log(`🔒 ${endpoint.method} ${endpoint.path}: 인증 필요 (예상됨)`);
      } else if (response.status === 200) {
        console.log(`✅ ${endpoint.method} ${endpoint.path}: 접근 가능`);
      } else {
        console.log(`⚠️  ${endpoint.method} ${endpoint.path}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.path}: 연결 실패`);
    }
  }

  console.log('');
}

// 4. 컴포넌트 빌드 확인
async function checkBuild() {
  console.log('4. 프론트엔드 빌드 확인');

  try {
    console.log('📦 빌드 실행 중...');
    execSync('pnpm --filter=beenest build', { stdio: 'pipe' });
    console.log('✅ 빌드 성공');
  } catch (error) {
    console.log('❌ 빌드 실패');
    console.log(error.stdout?.toString() || error.message);
  }

  console.log('');
}

// 5. 타입 체크
async function checkTypes() {
  console.log('5. TypeScript 타입 체크');

  try {
    execSync('pnpm --filter=beenest type-check', { stdio: 'pipe' });
    console.log('✅ 타입 체크 통과');
  } catch (error) {
    console.log('❌ 타입 에러 발견');
    console.log(error.stdout?.toString() || error.message);
  }

  console.log('');
}

// 6. 린트 체크
async function checkLint() {
  console.log('6. ESLint 체크');

  try {
    execSync('pnpm --filter=beenest lint', { stdio: 'pipe' });
    console.log('✅ 린트 체크 통과');
  } catch (error) {
    console.log('⚠️  린트 경고/에러 발견');
    console.log(error.stdout?.toString() || error.message);
  }

  console.log('');
}

// 메인 테스트 실행
async function runTests() {
  const serverStatus = await checkServers();

  if (!serverStatus) {
    console.log('❌ 서버가 실행되지 않았습니다. 먼저 pnpm dev를 실행하세요.');
    return;
  }

  await checkRoutes();
  await checkAPIEndpoints();
  await checkTypes();
  await checkLint();
  await checkBuild();

  console.log('🎉 E2E 테스트 완료!');
  console.log('\n📋 테스트 요약:');
  console.log('- 서버 연결 상태 확인');
  console.log('- 프론트엔드 라우팅 확인');
  console.log('- API 엔드포인트 구조 확인');
  console.log('- TypeScript 타입 체크');
  console.log('- ESLint 코드 품질 체크');
  console.log('- 프로덕션 빌드 확인');
}

// 스크립트 실행
runTests().catch(console.error);