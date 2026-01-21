package com.sudoku.validator;

public class SudokuBoardValidator {
  private static final int BOARD_SIZE = 9;
  private static final int BOX_SIZE = 3;

  private SudokuBoardValidator() {}

  public static boolean isValidBoard(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    for (int cell : board) {
      if (cell < 0 || cell > 9) {
        return false;
      }
    }

    return findDuplicates(board).length == 0;
  }

  public static boolean isValidCell(int[] board, int index) {
    if (board == null || index < 0 || index >= board.length) {
      return false;
    }

    int value = board[index];
    if (value == 0) {
      return true;
    }

    int row = index / BOARD_SIZE;
    int col = index % BOARD_SIZE;

    return !hasDuplicateInRow(board, row, index)
        && !hasDuplicateInCol(board, col, index)
        && !hasDuplicateInBox(board, row, col, index);
  }

  public static int[] findDuplicates(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return new int[0];
    }

    java.util.List<Integer> duplicates = new java.util.ArrayList<>();

    for (int i = 0; i < board.length; i++) {
      if (board[i] == 0) continue;

      int row = i / BOARD_SIZE;
      int col = i % BOARD_SIZE;

      if (hasDuplicateInRow(board, row, i)
          || hasDuplicateInCol(board, col, i)
          || hasDuplicateInBox(board, row, col, i)) {
        duplicates.add(i);
      }
    }

    return duplicates.stream().mapToInt(Integer::intValue).toArray();
  }

  public static boolean isComplete(int[] board) {
    if (!isValidBoard(board)) {
      return false;
    }

    for (int cell : board) {
      if (cell == 0) {
        return false;
      }
    }

    return true;
  }

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
}
