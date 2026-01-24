package com.sudoku.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameStartResponse {

  private Long gameId;
  private String puzzle;
  private String difficulty;
  private Integer hintLimit;
}
