package com.sudoku.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameCompleteRequest {

  @NotBlank(message = "Final board is required")
  private String finalBoard;

  @NotNull(message = "Completion time is required")
  @Min(value = 0, message = "Completion time must be non-negative")
  private Integer completionTime;
}
