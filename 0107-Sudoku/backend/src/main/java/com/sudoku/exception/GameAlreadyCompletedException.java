package com.sudoku.exception;

public class GameAlreadyCompletedException extends RuntimeException {

  public GameAlreadyCompletedException(String message) {
    super(message);
  }
}
