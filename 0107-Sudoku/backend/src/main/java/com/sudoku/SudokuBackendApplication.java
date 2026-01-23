package com.sudoku;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SudokuBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(SudokuBackendApplication.class, args);
  }
}
