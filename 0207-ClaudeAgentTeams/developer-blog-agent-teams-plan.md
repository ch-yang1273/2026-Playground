# 개발자 블로그 프로젝트 - Agent Teams 구성 계획

## 프로젝트 개요

**목표**: Next.js + Shadcn + Markdown 기반 개발자 블로그 구축
**방법론**: Claude Code Agent Teams를 활용한 병렬 개발
**예상 기간**: 2-3일 (4명 병렬 작업 기준)

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: Shadcn UI
- **스타일링**: Tailwind CSS v4
- **콘텐츠**: Markdown (remark/rehype)
- **코드 하이라이팅**: Prism.js 또는 Shiki
- **배포**: Vercel (권장)

## Agent Teams 구성

### 1. Setup Engineer
**역할**: 프로젝트 초기화 및 기반 설정

**담당 작업**:
- Next.js 프로젝트 생성 (`create-next-app`)
- TypeScript 설정 (`tsconfig.json` 최적화)
- Tailwind CSS 설치 및 설정
- 폴더 구조 설계 및 생성
- 환경변수 템플릿 작성
- Git 설정 (.gitignore, README 초안)
- 빌드 최적화 설정

**작업 영역**:
```
루트/
├── next.config.js
├── tsconfig.json
├── package.json
├── tailwind.config.ts
├── .env.example
└── README.md
```

**의존성**: 없음 (최우선 작업)

---

### 2. UI Developer
**역할**: 디자인 시스템 및 레이아웃 구축

**담당 작업**:
- Shadcn UI 초기 설정 (`npx shadcn-ui@latest init`)
- 필요한 Shadcn 컴포넌트 추가 (Button, Card, Badge 등)
- 공통 레이아웃 컴포넌트 제작
  - Header (네비게이션)
  - Footer
  - Container (반응형 래퍼)
- 블로그 카드 컴포넌트
- 다크모드 토글 구현
- 반응형 디자인 적용

**작업 영역**:
```
app/
└── layout.tsx

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
├── ui/           (Shadcn 자동 생성)
│   ├── button.tsx
│   ├── card.tsx
│   └── badge.tsx
└── BlogCard.tsx
```

**의존성**: Setup Engineer (프로젝트 초기화 완료 후)

---

### 3. Content Engineer
**역할**: Markdown 처리 시스템 구축

**담당 작업**:
- Markdown 라이브러리 설치 및 설정
  - `remark`, `remark-html`
  - `rehype-highlight` (코드 하이라이팅)
  - `gray-matter` (frontmatter 파싱)
- Markdown 파싱 유틸리티 함수 작성
- Frontmatter 타입 정의 (TypeScript)
- 블로그 포스트 데이터 fetching 로직
- 예제 마크다운 포스트 작성 (3개)
- 이미지 처리 로직 (public/images/)

**작업 영역**:
```
lib/
├── markdown.ts      (파싱 로직)
├── posts.ts         (포스트 CRUD)
└── types.ts         (타입 정의)

content/
└── posts/
    ├── example-post-1.md
    ├── example-post-2.md
    └── example-post-3.md

public/
└── images/
    └── posts/
```

**의존성**: Setup Engineer (프로젝트 초기화 완료 후)

---

### 4. Page Builder
**역할**: 블로그 페이지 구현

**담당 작업**:
- 홈페이지 (최신 포스트 목록)
- 블로그 리스트 페이지 (`/blog`)
  - 포스트 카드 그리드
  - 페이지네이션 (선택)
  - 태그 필터링 (선택)
- 블로그 포스트 상세 페이지 (`/blog/[slug]`)
  - 동적 라우팅
  - SEO 메타데이터 (generateMetadata)
  - OG 이미지 생성
- About 페이지 (선택)
- 404 페이지

**작업 영역**:
```
app/
├── page.tsx                    (홈)
├── blog/
│   ├── page.tsx               (리스트)
│   └── [slug]/
│       └── page.tsx           (상세)
├── about/
│   └── page.tsx
└── not-found.tsx
```

**의존성**:
- UI Developer (레이아웃 컴포넌트)
- Content Engineer (데이터 fetching 함수)

---

## 작업 단계 (Phases)

### Phase 1: 기반 구축 (병렬 실행)
**예상 시간**: 2-3시간

| Teammate | 작업 내용 | 우선순위 |
|----------|-----------|----------|
| Setup Engineer | 프로젝트 초기화, 기본 설정 | P0 (최우선) |
| UI Developer | Shadcn 설치 계획, 디자인 시스템 설계 | P1 |
| Content Engineer | Markdown 라이브러리 조사, 타입 설계 | P1 |
| Page Builder | 라우팅 구조 설계, 페이지 목록 작성 | P1 |

**완료 기준**:
- [ ] Next.js 프로젝트 실행 가능 (`npm run dev`)
- [ ] 폴더 구조 생성 완료
- [ ] 각 teammate의 작업 계획 문서화

---

### Phase 2: 핵심 구현 (병렬 실행)
**예상 시간**: 4-6시간

| Teammate | 작업 내용 | 블로킹 의존성 |
|----------|-----------|---------------|
| Setup Engineer | 빌드 최적화, 이미지 처리 설정 | Phase 1 완료 |
| UI Developer | 레이아웃 + 컴포넌트 구현 | Phase 1 완료 |
| Content Engineer | Markdown 파서 + 예제 포스트 작성 | Phase 1 완료 |
| Page Builder | 블로그 리스트 페이지 구현 | Phase 1 완료 |

**완료 기준**:
- [ ] 모든 컴포넌트 독립적으로 작동
- [ ] Markdown 파싱 테스트 통과
- [ ] 블로그 리스트 페이지 렌더링 성공

---

### Phase 3: 통합 및 완성 (순차/병렬 혼합)
**예상 시간**: 3-4시간

**통합 작업** (순차):
1. **UI Developer + Page Builder**: 레이아웃에 페이지 통합
2. **Content Engineer + Page Builder**: 포스트 상세 페이지 렌더링 통합
3. **Setup Engineer**: 전체 빌드 테스트 및 최적화

**병렬 작업**:
- UI Developer: 반응형 디자인 QA
- Content Engineer: 추가 예제 포스트 작성
- Page Builder: SEO 메타데이터 최적화
- Setup Engineer: 배포 설정 (Vercel)

**완료 기준**:
- [ ] 모든 페이지 정상 작동
- [ ] 반응형 디자인 검증
- [ ] 빌드 오류 없음 (`npm run build`)
- [ ] Lighthouse 점수 90+ (Performance, Accessibility, SEO)

---

## 파일 충돌 방지 전략

### 원칙
- 각 teammate는 **독립적인 파일/폴더**에서 작업
- 공통 파일 수정 시 **순차적으로 작업**
- 타입 정의는 **Content Engineer가 먼저 작성**, 다른 teammate는 import만

### 공통 파일 처리
| 파일 | 담당자 | 다른 teammate 역할 |
|------|--------|-------------------|
| `package.json` | Setup Engineer | 의존성 추가 요청만 |
| `tailwind.config.ts` | UI Developer | 설정 요청만 |
| `app/layout.tsx` | UI Developer | 완성 후 통합 |
| `lib/types.ts` | Content Engineer | import만 |

---

## 커뮤니케이션 프로토콜

### 메시지 타입
1. **message**: 특정 teammate에게 직접 전달
   ```
   예: Content Engineer → Page Builder
   "포스트 타입 정의 완료했습니다. lib/types.ts 확인해주세요."
   ```

2. **broadcast**: 전체 팀에게 전달 (신중히 사용)
   ```
   예: Setup Engineer → All
   "프로젝트 초기화 완료! npm install 후 작업 시작 가능합니다."
   ```

### 중요 이벤트 알림
- **Phase 완료**: 리더에게 완료 보고
- **블로킹 이슈**: 즉시 broadcast
- **타입 정의 변경**: 영향받는 teammate에게 message

---

## Agent Teams 실행 프롬프트

### 초기 팀 생성
```
개발자 블로그를 Next.js + Shadcn + Markdown으로 만들어줘.
4명의 teammate로 구성된 agent team을 생성해:

1. Setup Engineer (sonnet 모델):
   - Next.js 프로젝트 초기화
   - TypeScript, Tailwind 설정
   - 폴더 구조 생성

2. UI Developer (sonnet 모델):
   - Shadcn UI 설치 및 설정
   - 레이아웃 컴포넌트 구축
   - 블로그 카드 컴포넌트 제작

3. Content Engineer (sonnet 모델):
   - Markdown 파싱 시스템 구축
   - remark/rehype 설정
   - 예제 포스트 3개 작성

4. Page Builder (sonnet 모델):
   - 블로그 리스트 페이지 구현
   - 포스트 상세 페이지 구현
   - SEO 메타데이터 설정

각 teammate는 독립적인 파일 영역에서 작업하도록 하고,
Phase 2 완료 후 통합 작업을 진행해줘.
```

### 진행 중 제어
```
# 진행 상황 확인
"모든 teammate의 진행 상황을 요약해줘"

# 특정 teammate와 대화
Shift+Up/Down으로 teammate 선택 후 메시지 전송

# 작업 재할당
"Page Builder가 블로킹되어 있으니 About 페이지 먼저 작업해줘"

# 우아한 종료
"모든 작업 완료 확인 후 team cleanup 해줘"
```

---

## 예상 결과물

### 최종 폴더 구조
```
developer-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── ui/              (Shadcn)
│   └── BlogCard.tsx
├── lib/
│   ├── markdown.ts
│   ├── posts.ts
│   └── types.ts
├── content/
│   └── posts/
│       ├── *.md
├── public/
│   └── images/
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

### 주요 기능
- ✅ 반응형 블로그 리스트
- ✅ Markdown 렌더링 (코드 하이라이팅 포함)
- ✅ SEO 최적화 (메타데이터, OG 이미지)
- ✅ 다크모드 지원
- ✅ 정적 사이트 생성 (SSG)
- ✅ 빠른 페이지 로드 (Next.js 최적화)

---

## 리스크 및 대응 방안

### 리스크 1: 타입 불일치
**증상**: Page Builder가 Content Engineer의 타입을 사용할 때 오류
**대응**: Content Engineer가 Phase 1에서 타입 정의 먼저 완료 → 다른 teammate에게 알림

### 리스크 2: Shadcn 설치 충돌
**증상**: UI Developer가 components/ui/를 수정 중 다른 teammate가 같은 폴더 접근
**대응**: UI Developer가 Shadcn 초기 설치 완료할 때까지 다른 teammate 대기

### 리스크 3: 과도한 메시지
**증상**: 불필요한 broadcast로 인한 토큰 낭비
**대응**: broadcast는 Phase 완료 시에만 사용, 나머지는 message 사용

### 리스크 4: Teammate 조기 종료
**증상**: 작업 미완료 상태에서 teammate가 idle 상태로 전환
**대응**: 리더가 "작업 완료될 때까지 계속 진행" 명령

---

## 성공 지표

### 기술 지표
- [ ] TypeScript 타입 에러 0개
- [ ] Build 성공 (`npm run build`)
- [ ] Lighthouse Performance > 90
- [ ] 모든 페이지 렌더링 < 1초

### 프로세스 지표
- [ ] 파일 충돌 0건
- [ ] Phase 2까지 병렬 작업률 > 80%
- [ ] Teammate 간 메시지 응답 시간 < 5분

### 결과물 지표
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 3개 이상 예제 포스트
- [ ] 코드 하이라이팅 정상 작동
- [ ] SEO 메타데이터 모든 페이지 적용

---

## 참고 자료

- [Agent Teams 공식 문서](https://code.claude.com/docs/en/agent-teams)
- [Next.js 14 공식 문서](https://nextjs.org/docs)
- [Shadcn UI 문서](https://ui.shadcn.com/)
- [remark/rehype 플러그인](https://github.com/remarkjs/remark)

---

## 버전 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-02-07 | 초안 작성 |

---

**작성자**: Claude Code Agent Teams
**마지막 업데이트**: 2026-02-07