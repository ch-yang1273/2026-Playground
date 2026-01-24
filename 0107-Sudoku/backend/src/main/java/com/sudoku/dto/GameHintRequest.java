package com.sudoku.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameHintRequest {

  @NotBlank(message = "Current board is required")
  private String currentBoard;
}
