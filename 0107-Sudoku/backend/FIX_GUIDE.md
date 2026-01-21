# SudokuBoardValidator 테스트 실패 수정 가이드

## 1. 문제 요약

`SudokuBoardValidator` 클래스의 중복 검사 로직에 버그가 있어 6개의 테스트가 실패합니다.

---

## 2. 상세 문제 분석

### 2.1 버그가 있는 코드 위치

**파일:** `src/main/java/com/sudoku/validator/SudokuBoardValidator.java`

**메서드 3개:**
- `hasDuplicateInRow` (78-91행)
- `hasDuplicateInCol` (93-105행)
- `hasDuplicateInBox` (107-124행)

### 2.2 현재 잘못된 로직

```java
// hasDuplicateInRow 현재 코드 (78-91행)
private static boolean hasDuplicateInRow(int[] board, int row, int excludeIndex) {
    int start = row * BOARD_SIZE;
    int[] values = new int[10];

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (i == excludeIndex) continue;
      int val = board[i];
      if (val != 0) {
        if (values[val] > 0) return true;  // ❌ 잘못됨
        values[val]++;
      }
    }
    return false;
}
```

### 2.3 문제점 설명

**현재 동작 (잘못됨):**
- `excludeIndex`를 제외한 **다른 셀들 사이에서** 중복이 있는지 검사
- 예: `board[0]=1, board[1]=2, board[2]=3` → "1, 2, 3 사이에 중복 없음" → false

**올바른 동작:**
- `excludeIndex` 위치의 **값**이 같은 행/열/박스의 **다른 셀에 존재하는지** 검사
- 예: `board[0]=1, board[1]=1` 일 때 `excludeIndex=0` → "값 1이 다른 곳(index 1)에 있음" → true

### 2.4 실패하는 테스트 목록

| 테스트 메서드 | 실패 원인 |
|-------------|----------|
| `should_returnFalse_when_hasDuplicateInRow` | 행 중복 미검출 |
| `should_returnFalse_when_hasDuplicateInColumn` | 열 중복 미검출 |
| `should_returnFalse_when_hasDuplicateInBox` | 박스 중복 미검출 |
| `should_returnFalse_when_invalidCellDueToRowDuplicate` | isValidCell 실패 |
| `should_findDuplicatesInBoard` | 빈 배열 반환 |
| `should_returnFalse_when_completeBoardHasDuplicates` | isComplete 실패 |

---

## 3. 수정 방법

### 3.1 hasDuplicateInRow 수정 (78-91행)

**삭제할 코드:**
```java
private static boolean hasDuplicateInRow(int[] board, int row, int excludeIndex) {
    int start = row * BOARD_SIZE;
    int[] values = new int[10];

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (i == excludeIndex) continue;
      int val = board[i];
      if (val != 0) {
        if (values[val] > 0) return true;
        values[val]++;
      }
    }
    return false;
  }
```

**추가할 코드:**
```java
private static boolean hasDuplicateInRow(int[] board, int row, int excludeIndex) {
    int start = row * BOARD_SIZE;
    int targetValue = board[excludeIndex];

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (i == excludeIndex) continue;
      if (board[i] == targetValue) {
        return true;
      }
    }
    return false;
  }
```

### 3.2 hasDuplicateInCol 수정 (93-105행)

**삭제할 코드:**
```java
private static boolean hasDuplicateInCol(int[] board, int col, int excludeIndex) {
    int[] values = new int[10];

    for (int i = col; i < board.length; i += BOARD_SIZE) {
      if (i == excludeIndex) continue;
      int val = board[i];
      if (val != 0) {
        if (values[val] > 0) return true;
        values[val]++;
      }
    }
    return false;
  }
```

**추가할 코드:**
```java
private static boolean hasDuplicateInCol(int[] board, int col, int excludeIndex) {
    int targetValue = board[excludeIndex];

    for (int i = col; i < board.length; i += BOARD_SIZE) {
      if (i == excludeIndex) continue;
      if (board[i] == targetValue) {
        return true;
      }
    }
    return false;
  }
```

### 3.3 hasDuplicateInBox 수정 (107-124행)

**삭제할 코드:**
```java
private static boolean hasDuplicateInBox(int[] board, int row, int col, int excludeIndex) {
    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;
    int[] values = new int[10];

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int index = r * BOARD_SIZE + c;
        if (index == excludeIndex) continue;
        int val = board[index];
        if (val != 0) {
          if (values[val] > 0) return true;
          values[val]++;
        }
      }
    }
    return false;
  }
```

**추가할 코드:**
```java
private static boolean hasDuplicateInBox(int[] board, int row, int col, int excludeIndex) {
    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;
    int targetValue = board[excludeIndex];

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int index = r * BOARD_SIZE + c;
        if (index == excludeIndex) continue;
        if (board[index] == targetValue) {
          return true;
        }
      }
    }
    return false;
  }
```

---

## 4. 테스트 실행 방법

### 4.1 전체 테스트 실행

```bash
# backend 디렉토리에서 실행
cd backend
./gradlew test
```

### 4.2 특정 테스트 클래스만 실행

```bash
./gradlew test --tests "com.sudoku.validator.SudokuBoardValidatorTest"
```

### 4.3 특정 테스트 메서드만 실행

```bash
# 행 중복 테스트만 실행
./gradlew test --tests "com.sudoku.validator.SudokuBoardValidatorTest.should_returnFalse_when_hasDuplicateInRow"
```

### 4.4 테스트 결과 확인

테스트 결과 리포트 위치:
```
backend/build/reports/tests/test/index.html
```

---

## 5. 수정 전후 동작 비교

### 예시: `should_returnFalse_when_hasDuplicateInRow` 테스트

```java
// 테스트 코드
int[] board = createEmptyBoard();  // 81개 0으로 초기화
board[0] = 1;  // index 0에 값 1
board[1] = 1;  // index 1에 값 1 (같은 행에 중복!)
boolean result = SudokuBoardValidator.isValidBoard(board);
assertFalse(result);  // 중복이 있으므로 false 기대
```

**수정 전 동작:**
1. `isValidBoard` → `findDuplicates` 호출
2. `findDuplicates`에서 index 0 검사: `hasDuplicateInRow(board, 0, 0)`
3. `hasDuplicateInRow`가 index 1~8 검사
4. index 1의 값(1)을 `values[1]++`로 카운트
5. 다른 곳에 1이 없으므로 `values[1] > 0` 조건 미충족
6. **false 반환** (잘못됨!)
7. 테스트 실패

**수정 후 동작:**
1. `isValidBoard` → `findDuplicates` 호출
2. `findDuplicates`에서 index 0 검사: `hasDuplicateInRow(board, 0, 0)`
3. `hasDuplicateInRow`가 `targetValue = board[0] = 1` 저장
4. index 1~8 순회하며 `board[i] == 1` 비교
5. index 1에서 `board[1] == 1` → **true 반환** (정상!)
6. 테스트 통과

---

## 6. 핵심 변경 사항 요약

| 항목 | 수정 전 | 수정 후 |
|-----|--------|--------|
| 비교 방식 | `values` 배열로 카운팅 | `targetValue`와 직접 비교 |
| 검사 대상 | 다른 셀들 간의 중복 | 특정 값의 존재 여부 |
| 반환 조건 | `values[val] > 0` | `board[i] == targetValue` |

---

## 7. 체크리스트

수정 완료 후 확인:

- [ ] `hasDuplicateInRow` 메서드 수정 완료
- [ ] `hasDuplicateInCol` 메서드 수정 완료
- [ ] `hasDuplicateInBox` 메서드 수정 완료
- [ ] `./gradlew test` 실행하여 전체 테스트 통과 확인
- [ ] 테스트 리포트에서 19개 테스트 모두 통과 확인
