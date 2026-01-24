package com.sudoku.exception;

public class InvalidBoardException extends RuntimeException {

  public InvalidBoardException(String message) {
    super(message);
  }
}
