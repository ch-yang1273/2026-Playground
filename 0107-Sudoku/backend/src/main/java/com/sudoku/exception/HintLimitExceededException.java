package com.sudoku.exception;

public class HintLimitExceededException extends RuntimeException {

  public HintLimitExceededException(String message) {
    super(message);
  }
}
