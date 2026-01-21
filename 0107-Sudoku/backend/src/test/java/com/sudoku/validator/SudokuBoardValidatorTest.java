package com.sudoku.validator;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SudokuBoardValidatorTest {

  @Test
  void should_returnFalse_when_boardIsNull() {
    boolean result = SudokuBoardValidator.isValidBoard(null);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_boardSizeIsInvalid() {
    boolean result = SudokuBoardValidator.isValidBoard(new int[80]);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_cellValueIsInvalid() {
    int[] board = createEmptyBoard();
    board[0] = 10;
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_boardIsEmpty() {
    int[] board = createEmptyBoard();
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_hasDuplicateInRow() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 1;
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_hasDuplicateInColumn() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[9] = 1;
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_hasDuplicateInBox() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[10] = 1;
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_validCompleteBoard() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuBoardValidator.isValidBoard(board);
    assertTrue(result);
  }

  @Test
  void should_returnTrue_when_validCell() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    boolean result = SudokuBoardValidator.isValidCell(board, 0);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_invalidCellDueToRowDuplicate() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 1;
    boolean result = SudokuBoardValidator.isValidCell(board, 2);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_cellIsEmpty() {
    int[] board = createEmptyBoard();
    boolean result = SudokuBoardValidator.isValidCell(board, 0);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_cellIndexIsInvalid() {
    int[] board = createEmptyBoard();
    boolean result = SudokuBoardValidator.isValidCell(board, -1);
    assertFalse(result);
  }

  @Test
  void should_returnFalse_when_cellIndexExceedsBoardSize() {
    int[] board = createEmptyBoard();
    boolean result = SudokuBoardValidator.isValidCell(board, 81);
    assertFalse(result);
  }

  @Test
  void should_findDuplicatesInBoard() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 1;
    board[2] = 2;
    board[10] = 2;

    int[] result = SudokuBoardValidator.findDuplicates(board);

    assertTrue(result.length >= 2);
    assertTrue(contains(result, 0));
    assertTrue(contains(result, 1));
  }

  @Test
  void should_returnEmptyArray_when_noDuplicates() {
    int[] board = createEmptyBoard();
    board[0] = 1;
    board[1] = 2;
    board[2] = 3;

    int[] result = SudokuBoardValidator.findDuplicates(board);
    assertEquals(0, result.length);
  }

  @Test
  void should_returnFalse_when_boardIsIncomplete() {
    int[] board = createEmptyBoard();
    boolean result = SudokuBoardValidator.isComplete(board);
    assertFalse(result);
  }

  @Test
  void should_returnTrue_when_boardIsCompleteAndValid() {
    int[] board = createValidCompleteBoard();
    boolean result = SudokuBoardValidator.isComplete(board);
    assertTrue(result);
  }

  @Test
  void should_returnFalse_when_completeBoardHasDuplicates() {
    int[] board = createEmptyBoard();
    for (int i = 0; i < 81; i++) {
      board[i] = 1;
    }

    boolean result = SudokuBoardValidator.isComplete(board);
    assertFalse(result);
  }

  private int[] createEmptyBoard() {
    return new int[81];
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

  private boolean contains(int[] array, int value) {
    for (int item : array) {
      if (item == value) return true;
    }
    return false;
  }
}
