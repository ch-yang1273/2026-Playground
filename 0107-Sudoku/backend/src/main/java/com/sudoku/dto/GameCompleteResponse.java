package com.sudoku.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameCompleteResponse {

  private Long gameId;
  private Integer completionTime;
  private Integer hintCount;
  private Boolean isRankingEligible;
}
