package com.sudoku.exception;

public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException(String message) {
    super(message);
  }
}
