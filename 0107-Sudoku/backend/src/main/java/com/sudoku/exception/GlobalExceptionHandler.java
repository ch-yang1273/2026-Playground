package com.sudoku.exception;

import com.sudoku.dto.ErrorResponse;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(DuplicateEmailException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateEmail(DuplicateEmailException ex) {
    ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(DuplicateNicknameException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateNickname(DuplicateNicknameException ex) {
    ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
    ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED.value());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining(", "));
    ErrorResponse error = new ErrorResponse(message, HttpStatus.BAD_REQUEST.value());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
    ErrorResponse error = new ErrorResponse("An unexpected error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR.value());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
