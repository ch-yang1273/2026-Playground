package com.sudoku.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameGiveUpResponse {

  private Long gameId;
  private String solution;
}
