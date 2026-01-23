package com.sudoku.solver;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SudokuSolverTest {

  @Test
  void should_returnFalse_when_boardIsNull() {
    boolean result = SudokuSolver.solveNakedSingle(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid() {
    boolean result = SudokuSolver.solveNakedSingle(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_noEmptyCells() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.solveNakedSingle(board);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_noNakedSingle() {
    int[] board = createBoardWithMultipleCandidates();
    boolean result = SudokuSolver.solveNakedSingle(board);
    assertFalse(result);
    for (int cell : board) {
      assertTrue(cell == 0 || (cell > 0 && cell <= 9));
    }
  }

  @Test
  void should_solveNakedSingle_when_exists() {
    int[] board = createBoardWithNakedSingle();
    boolean result = SudokuSolver.solveNakedSingle(board);
    assertTrue(result);
    assertTrue(board[1] > 0 && board[1] <= 9);
  }

  @Test
  void should_solveMultipleNakedSingles() {
    int[] board = createBoardWithMultipleNakedSingles();
    boolean result = SudokuSolver.solveNakedSingle(board);
    assertTrue(result);
  }

  @Test
  void should_notModifyBoard_when_noNakedSingle() {
    int[] board = createBoardWithMultipleCandidates();
    int[] copy = board.clone();
    SudokuSolver.solveNakedSingle(board);
    assertArrayEquals(copy, board);
  }

  private int[] createValidCompleteBoard() {
    int[] board = new int[81];
    int[] row1 = {5, 3, 4, 6, 7, 8, 9, 1, 2};
    int[] row2 = {6, 7, 2, 1, 9, 5, 3, 4, 8};
    int[] row3 = {1, 9, 8, 3, 4, 2, 5, 6, 7};
    int[] row4 = {8, 5, 9, 7, 6, 1, 4, 2, 3};
    int[] row5 = {4, 2, 6, 8, 5, 3, 7, 9, 1};
    int[] row6 = {7, 1, 3, 9, 2, 4, 8, 5, 6};
    int[] row7 = {9, 6, 1, 5, 3, 7, 2, 8, 4};
    int[] row8 = {2, 8, 7, 4, 1, 9, 6, 3, 5};
    int[] row9 = {3, 4, 5, 2, 8, 6, 1, 7, 9};

    System.arraycopy(row1, 0, board, 0, 9);
    System.arraycopy(row2, 0, board, 9, 9);
    System.arraycopy(row3, 0, board, 18, 9);
    System.arraycopy(row4, 0, board, 27, 9);
    System.arraycopy(row5, 0, board, 36, 9);
    System.arraycopy(row6, 0, board, 45, 9);
    System.arraycopy(row7, 0, board, 54, 9);
    System.arraycopy(row8, 0, board, 63, 9);
    System.arraycopy(row9, 0, board, 72, 9);

    return board;
  }

  private int[] createBoardWithNakedSingle() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;
    board[9] = 3;
    board[11] = 4;
    board[18] = 5;
    board[19] = 6;
    return board;
  }

  private int[] createBoardWithMultipleNakedSingles() {
    int[] board = createEmptyBoard();

    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;

    board[9] = 2;
    board[10] = 3;
    board[11] = 4;
    board[12] = 5;
    board[13] = 6;
    board[14] = 7;
    board[15] = 8;
    board[16] = 9;

    return board;
  }

  private int[] createBoardWithMultipleCandidates() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 3;
    board[9] = 4;
    board[10] = 5;
    board[18] = 6;
    board[19] = 7;
    return board;
  }

  private int[] createEmptyBoard() {
    return new int[81];
  }

  private int countEmptyCells(int[] board) {
    int count = 0;
    for (int cell : board) {
      if (cell == 0) count++;
    }
    return count;
  }

  // ==================== Hidden Single Tests ====================

  @Test
  void should_returnFalse_when_boardIsNull_forHiddenSingle() {
    boolean result = SudokuSolver.solveHiddenSingle(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid_forHiddenSingle() {
    boolean result = SudokuSolver.solveHiddenSingle(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_noEmptyCells_forHiddenSingle() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.solveHiddenSingle(board);
    assertFalse(result);
  }

  @Test
  void should_findHiddenSingleInRow() {
    // Hidden Single: 특정 숫자가 행에서 단 한 칸에만 들어갈 수 있을 때
    int[] board = createBoardWithHiddenSingleInRow();
    boolean result = SudokuSolver.solveHiddenSingle(board);
    assertTrue(result);
    // 행 0에서 숫자 9가 들어갈 수 있는 유일한 위치는 index 1
    assertEquals(9, board[1]);
  }

  @Test
  void should_findHiddenSingleInCol() {
    // Hidden Single: 특정 숫자가 열에서 단 한 칸에만 들어갈 수 있을 때
    int[] board = createBoardWithHiddenSingleInCol();
    boolean result = SudokuSolver.solveHiddenSingle(board);
    assertTrue(result);
    // 열 0에서 숫자 9가 들어갈 수 있는 유일한 위치
    assertEquals(9, board[27]);
  }

  @Test
  void should_findHiddenSingleInBox() {
    // Hidden Single: 특정 숫자가 박스에서 단 한 칸에만 들어갈 수 있을 때
    int[] board = createBoardWithHiddenSingleInBox();
    boolean result = SudokuSolver.solveHiddenSingle(board);
    assertTrue(result);
    // 박스 0에서 숫자 9가 들어갈 수 있는 유일한 위치
    assertEquals(9, board[20]);
  }

  @Test
  void should_returnFalse_when_noHiddenSingle() {
    int[] board = createEmptyBoard();
    boolean result = SudokuSolver.solveHiddenSingle(board);
    assertFalse(result);
  }

  @Test
  void should_notModifyBoard_when_noHiddenSingle() {
    int[] board = createEmptyBoard();
    int[] copy = board.clone();
    SudokuSolver.solveHiddenSingle(board);
    assertArrayEquals(copy, board);
  }

  private int[] createBoardWithHiddenSingleInRow() {
    // 행 0에서 숫자 9가 index 1에만 들어갈 수 있도록 설정
    // 나머지 칸(0, 2-8)은 채워져있거나 9가 같은 열에 존재
    int[] board = createEmptyBoard();

    // 행 0: [1, _, 2, 3, 4, 5, 6, 7, 8] - index 1만 빈칸
    board[0] = 1;
    board[2] = 2;
    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;
    board[8] = 8;

    // 열 1에서 index 1 외에는 9 불가하도록 설정 필요 없음
    // 행 0에서 빈칸이 index 1뿐이므로 9는 index 1에만 들어갈 수 있음

    return board;
  }

  private int[] createBoardWithHiddenSingleInCol() {
    // 열 0에서 숫자 9가 index 27 (행 3, 열 0)에만 들어갈 수 있도록 설정
    int[] board = createEmptyBoard();

    // 열 0: index 0, 9, 18, 27, 36, 45, 54, 63, 72
    // 행 3 (index 27) 제외한 모든 위치 채움
    board[0] = 1;
    board[9] = 2;
    board[18] = 3;
    // board[27] = 빈칸 (여기에 9가 들어가야 함)
    board[36] = 4;
    board[45] = 5;
    board[54] = 6;
    board[63] = 7;
    board[72] = 8;

    // 이제 열 0에서 빈칸은 index 27뿐이고 9가 들어가야 함 (Hidden Single)

    return board;
  }

  private int[] createBoardWithHiddenSingleInBox() {
    // 박스 0 (행 0-2, 열 0-2)에서 숫자 9가 index 20 (행 2, 열 2)에만 들어갈 수 있도록 설정
    int[] board = createEmptyBoard();

    // 박스 0의 다른 셀에서 9 차단
    // 행 0 전체에 9 차단
    board[5] = 9; // 행 0에 9 배치

    // 행 1 전체에 9 차단
    board[14] = 9; // 행 1에 9 배치

    // 박스 0에서 행 2, 열 0-1 채움 (열 2만 빈칸)
    board[18] = 1; // (2,0) 채움
    board[19] = 2; // (2,1) 채움

    // 박스 0에서 (0,0), (0,1), (1,0), (1,1) 채움
    board[0] = 3;
    board[1] = 4;
    board[9] = 5;
    board[10] = 6;

    // (0,2), (1,2) 채움
    board[2] = 7;
    board[11] = 8;

    // 이제 박스0에서 빈칸은 index 20 = (2,2)뿐이고 9가 들어가야 함

    return board;
  }

  // ==================== Naked Pair Tests ====================

  @Test
  void should_returnFalse_when_boardIsNull_forNakedPair() {
    boolean result = SudokuSolver.solveNakedPair(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid_forNakedPair() {
    boolean result = SudokuSolver.solveNakedPair(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_noEmptyCells_forNakedPair() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertFalse(result);
  }

  @Test
  void should_findNakedPairInRowAndSolve() {
    // Naked Pair: 행에서 두 셀이 동일한 2개 후보만 가질 때
    // 다른 셀에서 해당 후보를 제거하면 Naked Single이 발생
    int[] board = createBoardWithNakedPairInRow();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertTrue(result);
  }

  @Test
  void should_findNakedPairInColAndSolve() {
    int[] board = createBoardWithNakedPairInCol();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertTrue(result);
  }

  @Test
  void should_findNakedPairInBoxAndSolve() {
    int[] board = createBoardWithNakedPairInBox();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_noNakedPair() {
    int[] board = createEmptyBoard();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertFalse(result);
  }

  @Test
  void should_notFindNakedPair_when_cellsHaveDifferentCandidates() {
    // 두 셀의 후보가 다르면 Naked Pair가 아님
    int[] board = createBoardWithDifferentCandidatePairs();
    boolean result = SudokuSolver.solveNakedPair(board);
    assertFalse(result);
  }

  private int[] createBoardWithNakedPairInRow() {
    // 행 0: index 0,1은 후보 {1,2}, index 2는 후보 {1,2,3}
    // Naked Pair {1,2}로 index 2에서 1,2 제거 → 3만 남음
    int[] board = createEmptyBoard();

    // 행 0: [_, _, _, 4, 5, 6, 7, 8, 9]
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[8] = 9;

    // index 0 (row 0, col 0, box 0) 후보를 {1,2}로 제한:
    // - col 0에 3 배치 (box 0 밖에서)
    board[27] = 3; // row 3, col 0 (box 3)

    // index 1 (row 0, col 1, box 0) 후보를 {1,2}로 제한:
    // - col 1에 3 배치 (box 0 밖에서)
    board[28] = 3; // row 3, col 1 (box 3)

    // index 2 (row 0, col 2, box 0) 후보가 {1,2,3}이 되려면:
    // - col 2에는 3이 없어야 함 ✓
    // - box 0에는 3이 없어야 함 ✓

    // Verification:
    // index 0: row={4-9}, col={3}, box={} → candidates={1,2}
    // index 1: row={4-9}, col={3}, box={} → candidates={1,2}
    // index 2: row={4-9}, col={}, box={} → candidates={1,2,3}

    return board;
  }

  private int[] createBoardWithNakedPairInCol() {
    // 열 0에서 index 0,9는 후보 {1,2}, index 18은 후보 {1,2,3}
    int[] board = createEmptyBoard();

    // 열 0: 대부분 채우고 3칸만 빈칸 (0, 9, 18)
    board[27] = 4;
    board[36] = 5;
    board[45] = 6;
    board[54] = 7;
    board[63] = 8;
    board[72] = 9;

    // index 0 (row 0, col 0, box 0) 후보 {1,2}: row 0에 3 배치 (box 0 밖)
    board[5] = 3; // row 0, col 5 (box 1)

    // index 9 (row 1, col 0, box 0) 후보 {1,2}: row 1에 3 배치 (box 0 밖)
    board[14] = 3; // row 1, col 5 (box 1)

    // index 18 (row 2, col 0, box 0) 후보 {1,2,3}:
    // - row 2에 3이 없어야 함 ✓
    // - box 0에 3이 없어야 함 ✓ (3은 box 1에 있음)

    // Verification:
    // index 0: row={3}, col={4-9}, box={} → candidates={1,2}
    // index 9: row={3}, col={4-9}, box={} → candidates={1,2}
    // index 18: row={}, col={4-9}, box={} → candidates={1,2,3}

    return board;
  }

  private int[] createBoardWithNakedPairInBox() {
    // 박스 0에서 index 0,1은 후보 {1,2}, index 2는 후보 {1,2,3}
    int[] board = createEmptyBoard();

    // 박스 0에서 3칸만 빈칸 (index 0, 1, 2 = row 0, col 0,1,2)
    board[9] = 4;  // (1,0)
    board[10] = 5; // (1,1)
    board[11] = 6; // (1,2)
    board[18] = 7; // (2,0)
    board[19] = 8; // (2,1)
    board[20] = 9; // (2,2)

    // 행 0의 나머지 채움 (4-9)
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[8] = 9;

    // index 0 (row 0, col 0) 후보 {1,2}: col 0에 3 배치 (box 0 밖)
    board[27] = 3; // row 3, col 0 (box 3)

    // index 1 (row 0, col 1) 후보 {1,2}: col 1에 3 배치 (box 0 밖)
    board[28] = 3; // row 3, col 1 (box 3)

    // index 2 (row 0, col 2) 후보 {1,2,3}:
    // - col 2에 3이 없어야 함 ✓
    // - box 0에 3이 없어야 함 ✓

    // Verification:
    // index 0: row={4-9}, col={3,4,5,6,7,8,9}, box={4-9} → candidates={1,2}
    // index 1: row={4-9}, col={3,5}, box={4-9} → candidates={1,2}
    // index 2: row={4-9}, col={6}, box={4-9} → candidates={1,2,3}

    return board;
  }

  private int[] createBoardWithDifferentCandidatePairs() {
    // 행 0에서 두 빈칸의 후보가 다름 → Naked Pair 아님
    int[] board = createEmptyBoard();

    // 행 0: [_, _, 3, 4, 5, 6, 7, 8, 9]
    board[2] = 3;
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[8] = 9;

    // index 0: 후보 {1,2} - 박스0에 3 배치 필요 없음 (이미 행에 있음)
    // index 1: 후보 다르게 - 열1에 1 배치
    board[10] = 1;

    return board;
  }

  // ==================== Pointing Pair/Triple Tests ====================

  @Test
  void should_returnFalse_when_boardIsNull_forPointing() {
    boolean result = SudokuSolver.solvePointing(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid_forPointing() {
    boolean result = SudokuSolver.solvePointing(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_noEmptyCells_forPointing() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.solvePointing(board);
    assertFalse(result);
  }

  @Test
  void should_findPointingPairInRowAndSolve() {
    int[] board = createBoardWithPointingPairInRow();
    boolean result = SudokuSolver.solvePointing(board);
    assertTrue(result);
  }

  @Test
  void should_findPointingPairInColAndSolve() {
    int[] board = createBoardWithPointingPairInCol();
    boolean result = SudokuSolver.solvePointing(board);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_noPointingPair() {
    int[] board = createEmptyBoard();
    boolean result = SudokuSolver.solvePointing(board);
    assertFalse(result);
  }

  private int[] createBoardWithPointingPairInRow() {
    // Box0: candidate 1 only in row 0 → pointing pair
    // Index 8 (row0,col8): {1,2} → eliminate 1 → naked single = 2
    int[] board = createEmptyBoard();

    board[12] = 1; // (1,3) blocks row 1 from 1 in box 0
    board[21] = 1; // (2,3) blocks row 2 from 1 in box 0

    board[3] = 3;
    board[4] = 4;
    board[5] = 5;
    board[6] = 6;
    board[7] = 7;

    board[35] = 8;
    board[44] = 9;

    return board;
  }

  private int[] createBoardWithPointingPairInCol() {
    // Box 0: candidate 1 only in col 0 (pointing pair)
    // Col 0, row 8: candidates {1,2} → eliminate 1 → solve to 2
    int[] board = createEmptyBoard();

    // Block 1 from cols 1,2 of box 0
    board[37] = 1; // row 4, col 1 (blocks col 1)
    board[47] = 1; // row 5, col 2 (blocks col 2)

    // Fill col 0 rows 3-7
    board[27] = 3;
    board[36] = 4;
    board[45] = 5;
    board[54] = 6;
    board[63] = 7;

    // Block 8,9 from index 72 via row 8
    board[77] = 8;
    board[78] = 9;

    // Now index 72: candidates = {1,2}
    // Pointing pair in box 0 col 0 eliminates 1 from index 72 → solves to 2

    return board;
  }

  // ==================== Backtracking Tests ====================

  @Test
  void should_returnFalse_when_boardIsNull_forBacktracking() {
    boolean result = SudokuSolver.solveBacktracking(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid_forBacktracking() {
    boolean result = SudokuSolver.solveBacktracking(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_boardIsAlreadySolved() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.solveBacktracking(board);
    assertTrue(result);
  }

  @Test
  void should_solveEmptyBoard_usingBacktracking() {
    int[] board = createEmptyBoard();
    boolean result = SudokuSolver.solveBacktracking(board);
    assertTrue(result);
    assertBoardIsComplete(board);
  }

  @Test
  void should_solveEasyPuzzle_usingBacktracking() {
    int[] board = createEasyPuzzle();
    boolean result = SudokuSolver.solveBacktracking(board);
    assertTrue(result);
    assertBoardIsComplete(board);
  }

  @Test
  void should_solveHardPuzzle_usingBacktracking() {
    int[] board = createHardPuzzle();
    boolean result = SudokuSolver.solveBacktracking(board);
    assertTrue(result);
    assertBoardIsComplete(board);
  }

  @Test
  void should_returnFalse_when_puzzleIsUnsolvable() {
    int[] board = createUnsolvablePuzzle();
    boolean result = SudokuSolver.solveBacktracking(board);
    assertFalse(result);
  }

  // ==================== Unique Solution Tests ====================

  @Test
  void should_returnFalse_when_boardIsNull_forUniqueSolution() {
    boolean result = SudokuSolver.hasUniqueSolution(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid_forUniqueSolution() {
    boolean result = SudokuSolver.hasUniqueSolution(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_puzzleHasUniqueSolution() {
    int[] board = createEasyPuzzle();
    boolean result = SudokuSolver.hasUniqueSolution(board);
    assertTrue(result);
  }

  @Test
  void should_returnTrue_when_boardIsAlreadySolved_forUniqueSolution() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuSolver.hasUniqueSolution(board);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_puzzleHasMultipleSolutions() {
    int[] board = createPuzzleWithMultipleSolutions();
    boolean result = SudokuSolver.hasUniqueSolution(board);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_emptyBoard_forUniqueSolution() {
    int[] board = createEmptyBoard();
    boolean result = SudokuSolver.hasUniqueSolution(board);
    assertFalse(result);
  }

  @Test
  void should_notModifyBoard_when_checkingUniqueSolution() {
    int[] board = createEasyPuzzle();
    int[] copy = board.clone();
    SudokuSolver.hasUniqueSolution(board);
    assertArrayEquals(copy, board);
  }

  private int[] createEasyPuzzle() {
    return new int[] {
      5, 3, 0, 0, 7, 0, 0, 0, 0,
      6, 0, 0, 1, 9, 5, 0, 0, 0,
      0, 9, 8, 0, 0, 0, 0, 6, 0,
      8, 0, 0, 0, 6, 0, 0, 0, 3,
      4, 0, 0, 8, 0, 3, 0, 0, 1,
      7, 0, 0, 0, 2, 0, 0, 0, 6,
      0, 6, 0, 0, 0, 0, 2, 8, 0,
      0, 0, 0, 4, 1, 9, 0, 0, 5,
      0, 0, 0, 0, 8, 0, 0, 7, 9
    };
  }

  private int[] createHardPuzzle() {
    return new int[] {
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 3, 0, 8, 5,
      0, 0, 1, 0, 2, 0, 0, 0, 0,
      0, 0, 0, 5, 0, 7, 0, 0, 0,
      0, 0, 4, 0, 0, 0, 1, 0, 0,
      0, 9, 0, 0, 0, 0, 0, 0, 0,
      5, 0, 0, 0, 0, 0, 0, 7, 3,
      0, 0, 2, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 4, 0, 0, 0, 9
    };
  }

  private int[] createUnsolvablePuzzle() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 3;
    board[3] = 4;
    board[4] = 5;
    board[5] = 6;
    board[6] = 7;
    board[7] = 8;
    board[17] = 9;
    board[26] = 9;
    board[80] = 9;
    return board;
  }

  private int[] createPuzzleWithMultipleSolutions() {
    return new int[] {
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 2, 3, 4, 5, 6, 7, 8, 9
    };
  }

  private void assertBoardIsComplete(int[] board) {
    for (int i = 0; i < board.length; i++) {
      assertTrue(board[i] >= 1 && board[i] <= 9, "Cell " + i + " is not filled");
    }
  }
}
