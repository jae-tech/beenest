# Beenest 디자인 시스템

Beenest 프로젝트를 위한 통합 디자인 시스템입니다. 소규모 창업자들을 위한 재고 및 거래처 관리 시스템에 최적화된 컴포넌트와 디자인 토큰을 제공합니다.

## 🎨 디자인 철학

- **단순함과 사용성**: 비기술적 사용자도 쉽게 사용할 수 있는 직관적인 인터페이스
- **브랜드 일관성**: Amber (#F59E0B) 기반의 따뜻하고 신뢰감 있는 브랜드 컬러
- **접근성**: 웹 접근성 표준(WCAG 2.1)을 준수하는 색상 대비와 키보드 네비게이션
- **반응형**: 모바일부터 데스크톱까지 모든 화면 크기에 대응

## 🛠 기술 스택

- **React 19** + **TypeScript**
- **TailwindCSS v4** + **@tailwindcss/vite**
- **class-variance-authority (CVA)**: 컴포넌트 변형 관리
- **clsx + tailwind-merge**: 클래스 이름 병합 및 중복 제거

## 🎯 핵심 컴포넌트

### Button 컴포넌트

7가지 변형과 5가지 크기를 지원하는 버튼 시스템:

```tsx
import { Button } from '@beenest/ui';

// 기본 사용법
<Button variant="primary" size="default">
  저장
</Button>

// 다양한 변형
<Button variant="secondary">취소</Button>
<Button variant="success">완료</Button>
<Button variant="warning">주의</Button>
<Button variant="error">삭제</Button>
<Button variant="outline">더보기</Button>
<Button variant="ghost">링크</Button>

// 크기 변형
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>
<Button size="icon">🔍</Button>
```

**변형 목록:**
- `primary`: 주요 액션 (Amber 브랜드 컬러)
- `secondary`: 보조 액션
- `outline`: 아웃라인 스타일
- `ghost`: 배경 없는 텍스트 버튼
- `success`: 성공/완료 액션 (녹색)
- `warning`: 경고 액션 (주황색)
- `error`: 위험/삭제 액션 (빨간색)

### Card 컴포넌트

유연한 카드 레이아웃 시스템:

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@beenest/ui';

<Card variant="elevated" hover="lift">
  <CardHeader>
    <CardTitle>재고 현황</CardTitle>
    <CardDescription>전체 상품 재고 요약</CardDescription>
  </CardHeader>
  <CardContent>
    <p>현재 재고: 1,234개</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">상세보기</Button>
  </CardFooter>
</Card>
```

**변형 목록:**
- `default`: 기본 카드
- `bordered`: 진한 테두리
- `elevated`: 그림자 효과
- `outline`: 아웃라인 스타일
- `ghost`: 투명 배경

**호버 효과:**
- `lift`: 마우스 오버 시 떠오르는 효과
- `glow`: 마우스 오버 시 테두리 강조

### Input 컴포넌트

다양한 상태와 크기를 지원하는 입력 필드:

```tsx
import { Input } from '@beenest/ui';

<Input
  variant="default"
  size="default"
  placeholder="상품명을 입력하세요"
/>

<Input
  variant="outline"
  state="error"
  placeholder="필수 입력 항목"
/>
```

**변형 목록:**
- `default`: 기본 스타일
- `filled`: 배경색 있는 스타일
- `outline`: 두꺼운 테두리
- `ghost`: 배경 없는 스타일

**상태:**
- `default`: 기본 상태
- `error`: 오류 상태 (빨간색)
- `success`: 성공 상태 (녹색)
- `warning`: 경고 상태 (주황색)

### Badge 컴포넌트

상태 표시를 위한 작은 라벨:

```tsx
import { Badge } from '@beenest/ui';

<Badge variant="success">재고 있음</Badge>
<Badge variant="warning">부족</Badge>
<Badge variant="error">품절</Badge>
<Badge variant="outline">진행중</Badge>
```

### Typography 컴포넌트

일관된 텍스트 스타일링:

```tsx
import { H1, H2, H3, P, Body, Caption, Label } from '@beenest/ui';

<H1>메인 제목</H1>
<H2>섹션 제목</H2>
<H3>서브섹션 제목</H3>
<P>문단 텍스트</P>
<Body>본문 텍스트</Body>
<Caption color="muted">설명 텍스트</Caption>
<Label>폼 라벨</Label>

// 또는 통합 컴포넌트 사용
<Typography variant="h1" color="primary">제목</Typography>
```

### Layout 컴포넌트

레이아웃을 위한 컨테이너와 그리드 시스템:

```tsx
import {
  Container,
  Grid,
  Flex,
  Stack,
  VStack,
  HStack,
  Section
} from '@beenest/ui';

// 컨테이너
<Container size="lg">
  <H1>페이지 내용</H1>
</Container>

// 그리드 레이아웃
<Grid cols={3} gap={6}>
  <Card>카드 1</Card>
  <Card>카드 2</Card>
  <Card>카드 3</Card>
</Grid>

// 플렉스 레이아웃
<Flex justify="between" align="center">
  <H2>제목</H2>
  <Button>액션</Button>
</Flex>

// 스택 레이아웃
<VStack gap={4}>
  <Input placeholder="이름" />
  <Input placeholder="이메일" />
  <Button>제출</Button>
</VStack>
```

## 🎨 디자인 토큰

### 색상 시스템

**브랜드 컬러 (Amber 기반)**
- Primary: `#F59E0B` (황금색/호박색)
- Primary Variants: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`

**시맨틱 컬러**
- Success: `#10B981` (에메랄드 녹색)
- Warning: `#F59E0B` (주황색)
- Error: `#EF4444` (빨간색)

**중성 컬러**
- Background: `#FFFFFF`
- Surface: `#F9FAFB`
- Border: `#E5E7EB`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Text Muted: `#9CA3AF`

### 타이포그래피

**폰트 크기 (rem 기반)**
- XS: `0.75rem` (12px)
- SM: `0.875rem` (14px)
- Base: `1rem` (16px)
- LG: `1.125rem` (18px)
- XL: `1.25rem` (20px)
- 2XL: `1.5rem` (24px)
- 3XL: `1.875rem` (30px)
- 4XL: `2.25rem` (36px)
- 5XL: `3rem` (48px)

**폰트 가중치**
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### 간격 시스템 (8px 기반)

- XS: `4px`
- SM: `8px`
- MD: `16px`
- LG: `24px`
- XL: `32px`
- 2XL: `48px`

### 테두리 반경

- SM: `4px`
- MD: `8px`
- LG: `12px`
- XL: `16px`
- 2XL: `24px`
- Full: `9999px`

### 그림자 효과

- XS: 미세한 그림자
- SM: 작은 그림자
- MD: 보통 그림자 (기본값)
- LG: 큰 그림자
- XL: 매우 큰 그림자
- 2XL: 최대 그림자

## 📱 반응형 디자인

모든 컴포넌트는 다음 브레이크포인트를 지원합니다:

- **SM**: 640px 이상 (모바일 가로)
- **MD**: 768px 이상 (태블릿)
- **LG**: 1024px 이상 (데스크톱)
- **XL**: 1280px 이상 (큰 데스크톱)
- **2XL**: 1536px 이상 (와이드 데스크톱)

## ♿ 접근성

### 키보드 네비게이션
- 모든 인터랙티브 요소는 Tab/Shift+Tab으로 접근 가능
- Enter/Space로 버튼 활성화
- Escape로 모달/드롭다운 닫기

### 색상 대비
- WCAG 2.1 AA 기준 준수 (최소 4.5:1 대비)
- 색상에만 의존하지 않는 정보 전달

### 스크린 리더
- 적절한 ARIA 라벨과 역할 설정
- 의미 있는 HTML 구조 사용

## 🔄 사용 패턴

### 일반적인 페이지 구조

```tsx
import {
  Container,
  VStack,
  HStack,
  H1,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@beenest/ui';

function DashboardPage() {
  return (
    <Container size="7xl">
      <VStack gap={8}>
        {/* 페이지 헤더 */}
        <HStack justify="between" align="center">
          <H1>재고 대시보드</H1>
          <Button variant="primary">
            새 상품 등록
          </Button>
        </HStack>

        {/* 통계 카드들 */}
        <Grid cols={4} gap={6}>
          <Card>
            <CardHeader>
              <CardTitle>전체 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>
          {/* 더 많은 카드들... */}
        </Grid>

        {/* 메인 콘텐츠 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 테이블이나 리스트 */}
          </CardContent>
        </Card>
      </VStack>
    </Container>
  );
}
```

### 폼 구조

```tsx
import {
  VStack,
  HStack,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@beenest/ui';

function ProductForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap={4}>
          <div>
            <Label>상품명</Label>
            <Input placeholder="상품명을 입력하세요" />
          </div>
          <div>
            <Label>가격</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div>
            <Label>재고 수량</Label>
            <Input type="number" placeholder="0" />
          </div>
        </VStack>
      </CardContent>
      <CardFooter>
        <HStack gap={3}>
          <Button variant="outline">취소</Button>
          <Button variant="primary">저장</Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}
```

## 🚀 시작하기

1. **패키지 설치**
   ```bash
   pnpm add @beenest/ui
   ```

2. **TailwindCSS 설정에 추가**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       "./node_modules/@beenest/ui/dist/**/*.{js,ts,jsx,tsx}",
       // 다른 경로들...
     ],
   }
   ```

3. **디자인 토큰 불러오기**
   ```css
   /* styles/globals.css */
   @import '@beenest/ui/styles/design-tokens.css';
   @import 'tailwindcss';
   ```

4. **컴포넌트 사용**
   ```tsx
   import { Button, Card, H1 } from '@beenest/ui';

   export default function App() {
     return (
       <Card>
         <H1>안녕하세요, Beenest!</H1>
         <Button variant="primary">시작하기</Button>
       </Card>
     );
   }
   ```

## 🎯 비즈니스 맞춤 설계

이 디자인 시스템은 소규모 창업자들의 재고 및 거래처 관리 업무에 특화되었습니다:

- **직관적인 색상**: Amber 브랜드 컬러로 따뜻하고 신뢰감 있는 느낌
- **터치 친화적**: 44px 최소 타겟 크기로 모바일 환경 최적화
- **비즈니스 중심**: 재고 상태, 주문 현황 등을 위한 시맨틱 색상
- **확장 가능**: 비즈니스 성장에 맞춰 새로운 컴포넌트 추가 용이

---

더 자세한 사용법과 예시는 각 컴포넌트의 TypeScript 정의와 Storybook 문서를 참조하세요.