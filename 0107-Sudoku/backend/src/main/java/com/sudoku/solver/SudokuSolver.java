package com.sudoku.solver;

public class SudokuSolver {
  private static final int BOARD_SIZE = 9;
  private static final int BOX_SIZE = 3;

  private SudokuSolver() {}

  public static boolean solveNakedSingle(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    boolean madeProgress = false;

    for (int i = 0; i < board.length; i++) {
      if (board[i] == 0) {
        int candidates = getCandidates(board, i);
        if (Integer.bitCount(candidates) == 1) {
          board[i] = Integer.numberOfTrailingZeros(candidates);
          madeProgress = true;
        }
      }
    }

    return madeProgress;
  }

  private static int getCandidates(int[] board, int index) {
    int row = index / BOARD_SIZE;
    int col = index % BOARD_SIZE;

    int usedValues = 0;

    for (int i = 0; i < BOARD_SIZE; i++) {
      int rowIndex = row * BOARD_SIZE + i;
      int colIndex = i * BOARD_SIZE + col;
      if (board[rowIndex] != 0) usedValues |= (1 << board[rowIndex]);
      if (board[colIndex] != 0) usedValues |= (1 << board[colIndex]);
    }

    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int boxIndex = r * BOARD_SIZE + c;
        if (board[boxIndex] != 0) usedValues |= (1 << board[boxIndex]);
      }
    }

    return ~usedValues & 0x3FE;
  }
}
