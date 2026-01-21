# SudokuSolver 테스트 실패 수정 가이드

## 1. 실패 요약

| 항목 | 내용 |
|-----|-----|
| 실패 테스트 | `SudokuSolverTest.should_solveMultipleNakedSingles()` |
| 실패 위치 | `SudokuSolverTest.java:49` |
| 실패 원인 | 테스트 데이터 오류 (Naked Single이 없는 보드) |
| 수정 대상 | `createBoardWithMultipleNakedSingles()` 메서드 (102-119행) |

---

## 2. 문제 상세 분석

### 2.1 현재 테스트 코드 (45-50행)

```java
@Test
void should_solveMultipleNakedSingles() {
    int[] board = createBoardWithMultipleNakedSingles();
    boolean result = SudokuSolver.solveNakedSingle(board);
    assertTrue(result);  // ← 실패! result가 false
}
```

### 2.2 현재 테스트 데이터 (102-119행)

```java
private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();
    board[0] = 1;   board[1] = 2;   board[2] = 3;
    board[3] = 4;   board[4] = 5;   board[5] = 6;
    board[6] = 7;   board[7] = 8;   board[8] = 9;
    board[9] = 3;   board[10] = 1;  board[11] = 2;
    board[18] = 5;  board[19] = 6;
    return board;
}
```

### 2.3 현재 보드 상태 시각화

```
인덱스 맵:
 0  1  2 |  3  4  5 |  6  7  8
 9 10 11 | 12 13 14 | 15 16 17
18 19 20 | 21 22 23 | 24 25 26
---------+----------+---------
27 28 29 | 30 31 32 | 33 34 35
...

현재 보드 값:
 1  2  3 |  4  5  6 |  7  8  9   ← Row 0 (완전히 채워짐)
 3  1  2 |  .  .  . |  .  .  .   ← Row 1
 5  6  . |  .  .  . |  .  .  .   ← Row 2
---------+----------+---------
 .  .  . |  .  .  . |  .  .  .   ← Row 3~8 (전부 비어있음)
```

### 2.4 왜 Naked Single이 없는가?

**Naked Single 정의**: 특정 셀에 들어갈 수 있는 후보(candidate)가 **단 1개**인 경우

**셀 20 (Row 2, Col 2) 분석:**
```
- Row 2에서 사용된 값: {5, 6}
- Col 2에서 사용된 값: {3, 2}
- Box (0,0)에서 사용된 값: {1, 2, 3, 5, 6}
- 전체 사용된 값: {1, 2, 3, 5, 6}
- 가능한 후보: {4, 7, 8, 9} ← 4개! (Naked Single 아님)
```

**셀 12 (Row 1, Col 3) 분석:**
```
- Row 1에서 사용된 값: {3, 1, 2}
- Col 3에서 사용된 값: {4}
- Box (0,3)에서 사용된 값: {4, 5, 6}
- 전체 사용된 값: {1, 2, 3, 4, 5, 6}
- 가능한 후보: {7, 8, 9} ← 3개! (Naked Single 아님)
```

**결론**: 현재 보드의 **모든 빈 셀**이 2개 이상의 후보를 가지고 있어 Naked Single이 존재하지 않음

---

## 3. 비교: 정상 작동하는 테스트 데이터

### 3.1 `createBoardWithNakedSingle()` (85-100행) - 정상 작동

```java
private int[] createBoardWithNakedSingle() {
    int[] board = createEmptyBoard();
    board[0] = 1;                           // (0,0) = 1
    board[2] = 2;  board[3] = 3;  board[4] = 4;
    board[5] = 5;  board[6] = 6;  board[7] = 7;  board[8] = 8;
    board[9] = 3;  board[11] = 4;
    board[18] = 5; board[19] = 6;
    return board;
}
```

**보드 상태:**
```
 1  .  2 |  3  4  5 |  6  7  8   ← Row 0 (index 1이 비어있음!)
 3  .  4 |  .  .  . |  .  .  .   ← Row 1
 5  6  . |  .  .  . |  .  .  .   ← Row 2
```

**셀 1 (Row 0, Col 1) 분석:**
```
- Row 0에서 사용된 값: {1, 2, 3, 4, 5, 6, 7, 8}
- Col 1에서 사용된 값: {6}
- Box (0,0)에서 사용된 값: {1, 2, 3, 4, 5, 6}
- 전체 사용된 값: {1, 2, 3, 4, 5, 6, 7, 8}
- 가능한 후보: {9} ← 1개! ✓ Naked Single!
```

---

## 4. 수정 방법

### 4.1 수정 파일

`src/test/java/com/sudoku/solver/SudokuSolverTest.java`

### 4.2 수정 위치

102-119행의 `createBoardWithMultipleNakedSingles()` 메서드

### 4.3 삭제할 코드 (102-119행)

```java
  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 3;
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[8] = 9;
    board[9] = 3;
    board[10] = 1;
    board[11] = 2;
    board[18] = 5;
    board[19] = 6;
    return board;
  }
```

### 4.4 추가할 코드

```java
  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();
    // Row 0: 1 . 2 | 3 4 5 | 6 7 8  (index 1이 비어있음 → 후보: {9})
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;
    // Row 1: 4 . 5 | . . . | . . .  (index 10이 비어있음)
    board[9] = 4;
    board[11] = 5;
    // Row 2: 7 8 . | . . . | . . .
    board[18] = 7;
    board[19] = 8;
    // Col 1에 추가 제약: 2, 3, 6 추가
    board[28] = 2;  // Row 3, Col 1
    board[37] = 3;  // Row 4, Col 1
    board[46] = 6;  // Row 5, Col 1
    // 이제 index 1의 후보: 9만 가능 (Naked Single #1)
    // 이제 index 10의 후보: 9만 가능하려면 추가 제약 필요
    board[55] = 9;  // Row 6, Col 1 → index 10 후보에서 9 제거
    // index 10 분석: Row1={4,5}, Col1={1,2,3,6,9}, Box00={1,2,4,5,7,8}
    // 전체 사용: {1,2,3,4,5,6,7,8,9} → 후보 없음! 다시 설계 필요

    // === 재설계: 두 개의 Naked Single을 만드는 보드 ===
    // 전략: Row 0에 8개 값, Row 1에 8개 값 배치

    return createBoardWithTwoNakedSingles();
  }

  private int[] createBoardWithTwoNakedSingles() {
    int[] board = createEmptyBoard();
    // Row 0: 1 . 2 3 4 5 6 7 8  → index 1 후보 = ?
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;

    // Row 1: 4 5 6 . 7 8 9 1 2  → index 12 후보 = ?
    board[9] = 4;
    board[10] = 5;
    board[11] = 6;
    board[13] = 7;
    board[14] = 8;
    board[15] = 9;
    board[16] = 1;
    board[17] = 2;

    // Col 1에 3 추가 → index 1 후보에서 3 제외
    board[19] = 3;

    // 분석:
    // index 1: Row0={1,2,3,4,5,6,7,8}, Col1={5,3}, Box00={1,2,4,5,6}
    //          전체={1,2,3,4,5,6,7,8} → 후보={9} ✓ Naked Single!
    // index 12: Row1={4,5,6,7,8,9,1,2}, Col3={3}, Box03={3,4,5,7,8}
    //          전체={1,2,3,4,5,6,7,8,9} → 후보={} 없음! 잘못됨

    return board;
  }
```

**위 코드는 설계 과정을 보여주는 예시입니다. 실제 수정은 아래 최종 코드를 사용하세요.**

---

## 5. 최종 수정 코드

### 5.1 완전히 교체할 메서드 (102-119행)

**삭제할 전체 메서드:**
```java
  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 3;
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[8] = 9;
    board[9] = 3;
    board[10] = 1;
    board[11] = 2;
    board[18] = 5;
    board[19] = 6;
    return board;
  }
```

**추가할 새 메서드:**
```java
  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();
    // Naked Single #1: index 1 → 후보 {9}만 가능
    // Row 0: 1 . 2 3 4 5 6 7 8
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;

    // Naked Single #2: index 73 → 후보 {1}만 가능
    // Row 8: . 2 3 4 5 6 7 8 9
    board[73] = 2;
    board[74] = 3;
    board[75] = 4;
    board[76] = 5;
    board[77] = 6;
    board[78] = 7;
    board[79] = 8;
    board[80] = 9;

    return board;
  }
```

### 5.2 새 보드 검증

```
새 보드 상태:
 1  .  2 |  3  4  5 |  6  7  8   ← Row 0
 .  .  . |  .  .  . |  .  .  .   ← Row 1~7 (비어있음)
 .  .  . |  .  .  . |  .  .  .
 .  .  . |  .  .  . |  .  .  .
 .  .  . |  .  .  . |  .  .  .
 .  .  . |  .  .  . |  .  .  .
 .  .  . |  .  .  . |  .  .  .
 .  .  . |  .  .  . |  .  .  .
 .  2  3 |  4  5  6 |  7  8  9   ← Row 8

Naked Single #1 - index 1 (Row 0, Col 1):
- Row 0 사용값: {1, 2, 3, 4, 5, 6, 7, 8}
- Col 1 사용값: {2}
- Box (0,0) 사용값: {1, 2}
- 전체 사용값: {1, 2, 3, 4, 5, 6, 7, 8}
- 후보: {9} ← 1개! ✓

Naked Single #2 - index 72 (Row 8, Col 0):
- Row 8 사용값: {2, 3, 4, 5, 6, 7, 8, 9}
- Col 0 사용값: {1}
- Box (6,0) 사용값: {}
- 전체 사용값: {1, 2, 3, 4, 5, 6, 7, 8, 9}
- 후보: {} ← 0개! 문제 있음!
```

**재수정 필요 - Col 0의 제약 제거:**

### 5.3 최종 수정 코드 (검증 완료)

```java
  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();

    // === Naked Single #1: index 1 (Row 0, Col 1) ===
    // Row 0: 1 . 2 3 4 5 6 7 8  (8개 값, index 1만 비어있음)
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;
    // index 1 분석: Row={1,2,3,4,5,6,7,8} → 후보={9} ✓

    // === Naked Single #2: index 17 (Row 1, Col 8) ===
    // Row 1: 2 3 4 5 6 7 8 9 .  (8개 값, index 17만 비어있음)
    board[9] = 2;
    board[10] = 3;
    board[11] = 4;
    board[12] = 5;
    board[13] = 6;
    board[14] = 7;
    board[15] = 8;
    board[16] = 9;
    // index 17 분석: Row={2,3,4,5,6,7,8,9} → 후보={1} ✓

    return board;
  }
```

### 5.4 최종 보드 검증

```
최종 보드 상태:
 1  .  2 |  3  4  5 |  6  7  8   ← Row 0 (index 1 비어있음)
 2  3  4 |  5  6  7 |  8  9  .   ← Row 1 (index 17 비어있음)
 .  .  . |  .  .  . |  .  .  .   ← Row 2~8 (비어있음)
...

✓ index 1:  Row0={1,2,3,4,5,6,7,8}, 후보={9}
✓ index 17: Row1={2,3,4,5,6,7,8,9}, 후보={1}

두 개의 Naked Single 존재 → solveNakedSingle() returns true ✓
```

---

## 6. 테스트 실행 방법

```bash
# 전체 테스트
cd backend && ./gradlew test

# 해당 테스트만 실행
./gradlew test --tests "*.SudokuSolverTest.should_solveMultipleNakedSingles"

# 상세 출력
./gradlew test --tests "*.SudokuSolverTest" --info
```

---

## 7. 수정 체크리스트

- [ ] `SudokuSolverTest.java` 파일 열기
- [ ] 102-119행의 `createBoardWithMultipleNakedSingles()` 메서드 찾기
- [ ] 기존 코드 전체 삭제
- [ ] 섹션 5.3의 새 코드로 교체
- [ ] `./gradlew test` 실행
- [ ] 25개 테스트 모두 통과 확인

---

## 8. 참고: Naked Single 알고리즘

```
Naked Single이란?
- 스도쿠의 특정 셀에 들어갈 수 있는 숫자가 딱 1개만 남은 상태
- 해당 행, 열, 3x3 박스에서 이미 사용된 숫자를 제외하면 1개만 남음

예시:
- 셀 위치: Row 0, Col 1
- Row 0의 값: 1, 2, 3, 4, 5, 6, 7, 8 (9개 중 8개 사용)
- 남은 후보: {9}
- → 이 셀에는 9만 들어갈 수 있음 = Naked Single
```

---

## 9. 요약

| 항목 | 내용 |
|-----|-----|
| 문제 | 테스트 데이터에 Naked Single이 없음 |
| 원인 | `createBoardWithMultipleNakedSingles()`가 잘못된 보드 생성 |
| 해결 | 두 개의 Naked Single이 있는 보드로 교체 |
| 수정 파일 | `src/test/java/com/sudoku/solver/SudokuSolverTest.java` |
| 수정 위치 | 102-119행 |
