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

  public static boolean solveHiddenSingle(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    for (int num = 1; num <= BOARD_SIZE; num++) {
      for (int i = 0; i < BOARD_SIZE; i++) {
        int rowHiddenIndex = findHiddenSingleInRow(board, i, num);
        if (rowHiddenIndex != -1) {
          board[rowHiddenIndex] = num;
          return true;
        }

        int colHiddenIndex = findHiddenSingleInCol(board, i, num);
        if (colHiddenIndex != -1) {
          board[colHiddenIndex] = num;
          return true;
        }

        int boxHiddenIndex = findHiddenSingleInBox(board, i, num);
        if (boxHiddenIndex != -1) {
          board[boxHiddenIndex] = num;
          return true;
        }
      }
    }

    return false;
  }

  private static int findHiddenSingleInRow(int[] board, int row, int num) {
    int start = row * BOARD_SIZE;
    int count = 0;
    int index = -1;

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (board[i] == 0 && canPlace(board, i, num)) {
        count++;
        index = i;
      }
    }

    return count == 1 ? index : -1;
  }

  private static int findHiddenSingleInCol(int[] board, int col, int num) {
    int count = 0;
    int index = -1;

    for (int i = col; i < board.length; i += BOARD_SIZE) {
      if (board[i] == 0 && canPlace(board, i, num)) {
        count++;
        index = i;
      }
    }

    return count == 1 ? index : -1;
  }

  private static int findHiddenSingleInBox(int[] board, int box, int num) {
    int boxStartRow = (box / 3) * BOX_SIZE;
    int boxStartCol = (box % 3) * BOX_SIZE;
    int count = 0;
    int index = -1;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int i = r * BOARD_SIZE + c;
        if (board[i] == 0 && canPlace(board, i, num)) {
          count++;
          index = i;
        }
      }
    }

    return count == 1 ? index : -1;
  }

  private static boolean canPlace(int[] board, int index, int num) {
    int row = index / BOARD_SIZE;
    int col = index % BOARD_SIZE;

    for (int i = 0; i < BOARD_SIZE; i++) {
      if (board[row * BOARD_SIZE + i] == num) return false;
      if (board[i * BOARD_SIZE + col] == num) return false;
    }

    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        if (board[r * BOARD_SIZE + c] == num) return false;
      }
    }

    return true;
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
