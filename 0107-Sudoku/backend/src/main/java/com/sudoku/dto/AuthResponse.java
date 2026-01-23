package com.sudoku.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

  private String token;
  private String email;
  private String nickname;
  private String role;
}
