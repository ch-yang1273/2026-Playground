# 스도쿠 프로젝트 기능 정의서

## 1. 프로젝트 개요

TDD 기반 스도쿠 웹 애플리케이션. 사용자가 난이도별 스도쿠 퍼즐을 플레이하고, 관리자가 퍼즐을 관리할 수 있는 시스템.

---

## 2. 사용자 유형

### 비회원
- 게임 플레이 가능
- 기록 저장 불가
- 랭킹 등록 불가

### 회원
- 게임 플레이 가능
- 기록 저장
- 랭킹 등록 (힌트 미사용 시)

### 관리자
- 퍼즐 관리
- 기록/통계 조회

---

## 3. 게임 플레이 기능

### 게임 시작
- 난이도 선택 (Easy/Medium/Hard/Expert)
- 미리 생성된 퍼즐 풀에서 랜덤 배정
- 타이머 시작

### 숫자 입력
- 빈 셀 선택 후 숫자 입력 (1-9)
- 키보드 입력 지원
- 클릭/터치 입력 지원
- 숫자 삭제

### 메모 모드
- 후보 숫자 기록 (복수 가능)
- 메모 모드 토글
- 메모 삭제

### 실행 취소
- Undo (실행 취소)
- Redo (다시 실행)
- 입력/삭제/메모 모두 대상

### 오류 표시
- 같은 행/열/박스 중복 숫자 실시간 표시
- 정답 여부는 표시 안 함 (힌트 기능에서만 공개)

### 힌트
- 선택한 셀의 정답 공개
- 난이도별 횟수 제한:
  - Easy: 5회
  - Medium: 3회
  - Hard: 2회
  - Expert: 1회
- 힌트 사용 시 랭킹 등록 제외

### 타이머
- 경과 시간 표시
- 일시정지/재개
- 일시정지 시 보드 숨김

### 게임 종료
- 포기 (게임 포기)
- 완료 (모든 셀 정답 입력 시 자동 완료)

---

## 4. 게임 완료

### 완료 화면
- 완료 시간 표시
- 힌트 사용 횟수 표시
- 난이도 표시

### 기록 저장 (회원)
- 완료 시간
- 힌트 사용 횟수
- 난이도
- 완료 일시

### 랭킹 등록 조건
- 회원만 가능
- 힌트 미사용 시에만 등록
- 난이도별 완료 시간 기준 정렬

---

## 5. 회원 기능

### 회원가입
- 이메일
- 비밀번호
- 닉네임

### 로그인/로그아웃
- JWT 기반 인증

### 마이페이지
- 내 기록 조회
- 난이도별 필터
- 최고 기록 표시

---

## 6. 랭킹

### 난이도별 랭킹 페이지
- Easy/Medium/Hard/Expert 탭
- 순위, 닉네임, 완료 시간 표시
- 힌트 사용 기록 제외

---

## 7. 관리자 기능

### 퍼즐 관리
- 퍼즐 목록 조회 (난이도별 필터)
- 퍼즐 배치 생성 (난이도, 개수 지정)
- 퍼즐 활성화/비활성화
- 퍼즐 삭제

### 기록 조회
- 전체 플레이 기록 목록
- 난이도별/기간별 필터
- 회원별 검색

### 통계 대시보드
- 난이도별 완료율
- 난이도별 평균 완료 시간
- 일별/주별 플레이 수

---

## 8. 퍼즐 풀 시스템

### 사전 생성
- 난이도별 퍼즐 풀 유지
- 최소 보유 개수:
  - Easy: 50개
  - Medium: 50개
  - Hard: 30개
  - Expert: 20개

### 퍼즐 생성 로직
1. 완성 보드 생성 (백트래킹 알고리즘)
2. 셀 제거하면서 유일해 검증
3. 난이도 판정 (풀이 기법 기반)

### 난이도 판정 기준
- **Easy**: Naked Single만으로 풀이 가능
- **Medium**: Hidden Single 필요
- **Hard**: Naked Pair/Pointing 필요
- **Expert**: 백트래킹 필요

---

## 9. 기술 스택

### 프론트엔드
- Vue.js
- 반응형 디자인 (모바일/데스크톱)
- 키보드 단축키 지원

### 백엔드
- Spring Boot
- REST API
- JWT 인증

### 데이터베이스
- MariaDB

### 테스트
- Backend: JUnit
- Frontend: Vitest
- E2E: Playwright

---

## 10. 데이터베이스 설계

### users 테이블
- id (PK)
- email (UNIQUE)
- password
- nickname
- role (USER/ADMIN)
- created_at
- updated_at

### puzzles 테이블
- id (PK)
- difficulty (EASY/MEDIUM/HARD/EXPERT)
- initial_board (JSON, 81자리)
- solution (JSON, 81자리)
- is_active
- created_at

### game_records 테이블
- id (PK)
- user_id (FK, nullable)
- puzzle_id (FK)
- completion_time (초 단위)
- hint_count
- is_completed
- created_at

---

## 11. API 엔드포인트

### 인증
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인
- POST /api/auth/logout - 로그아웃

### 게임
- GET /api/games/start?difficulty={difficulty} - 게임 시작 (퍼즐 배정)
- POST /api/games/{id}/complete - 게임 완료
- POST /api/games/{id}/give-up - 게임 포기

### 랭킹
- GET /api/rankings?difficulty={difficulty} - 난이도별 랭킹 조회

### 회원
- GET /api/users/me - 내 정보 조회
- GET /api/users/me/records - 내 기록 조회

### 관리자
- GET /api/admin/puzzles - 퍼즐 목록 조회
- POST /api/admin/puzzles/generate - 퍼즐 배치 생성
- PATCH /api/admin/puzzles/{id} - 퍼즐 수정 (활성화/비활성화)
- DELETE /api/admin/puzzles/{id} - 퍼즐 삭제
- GET /api/admin/records - 기록 조회
- GET /api/admin/statistics - 통계 조회

---

## 12. TDD 우선순위

### 1단계: 스도쿠 핵심 로직 (순수 함수)
1. 보드 유효성 검사 (isValidBoard)
2. 셀 유효성 검사 (isValidCell)
3. 중복 검사 (findDuplicates)
4. 완료 검사 (isComplete)

### 2단계: 풀이 알고리즘
1. Naked Single 풀이
2. Hidden Single 풀이
3. Naked Pair 풀이
4. Pointing 풀이
5. 백트래킹 풀이
6. 유일해 검증 (hasUniqueSolution)

### 3단계: 생성 알고리즘
1. 완성 보드 생성
2. 셀 제거 + 유일해 유지
3. 난이도 판정 (getDifficulty)
4. 난이도별 퍼즐 생성 (generatePuzzle)

### 4단계: API 테스트
1. 인증 API
2. 게임 API
3. 랭킹 API
4. 관리자 API

### 5단계: 프론트엔드 테스트
1. 보드 컴포넌트
2. 입력 처리
3. 메모 기능
4. Undo/Redo
5. 타이머

### 6단계: E2E 테스트
1. 게임 플레이 시나리오
2. 회원가입/로그인 시나리오
3. 관리자 시나리오
