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
}
