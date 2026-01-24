package com.sudoku.exception;

public class NoPuzzleAvailableException extends RuntimeException {

  public NoPuzzleAvailableException(String message) {
    super(message);
  }
}
