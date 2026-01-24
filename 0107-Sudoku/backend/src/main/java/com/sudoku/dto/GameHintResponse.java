package com.sudoku.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameHintResponse {

  private Integer row;
  private Integer col;
  private Integer value;
  private Integer remainingHints;
}
