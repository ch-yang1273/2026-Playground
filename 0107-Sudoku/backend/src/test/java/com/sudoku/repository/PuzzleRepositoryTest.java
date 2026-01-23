package com.sudoku.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.sudoku.domain.Difficulty;
import com.sudoku.domain.Puzzle;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
class PuzzleRepositoryTest {

  @Autowired
  private PuzzleRepository puzzleRepository;

  private static final String SAMPLE_BOARD =
      "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
  private static final String SAMPLE_SOLUTION =
      "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

  private Puzzle testPuzzle;

  @BeforeEach
  void setUp() {
    testPuzzle = Puzzle.builder()
        .difficulty(Difficulty.EASY)
        .initialBoard(SAMPLE_BOARD)
        .solution(SAMPLE_SOLUTION)
        .isActive(true)
        .build();
  }

  @Test
  void should_savePuzzle_when_validPuzzleProvided() {
    Puzzle savedPuzzle = puzzleRepository.save(testPuzzle);

    assertThat(savedPuzzle.getId()).isNotNull();
    assertThat(savedPuzzle.getDifficulty()).isEqualTo(Difficulty.EASY);
    assertThat(savedPuzzle.getInitialBoard()).isEqualTo(SAMPLE_BOARD);
    assertThat(savedPuzzle.getSolution()).isEqualTo(SAMPLE_SOLUTION);
    assertThat(savedPuzzle.getIsActive()).isTrue();
  }

  @Test
  void should_findPuzzlesByDifficulty_when_activePuzzlesExist() {
    puzzleRepository.save(testPuzzle);

    Puzzle mediumPuzzle = Puzzle.builder()
        .difficulty(Difficulty.MEDIUM)
        .initialBoard(SAMPLE_BOARD)
        .solution(SAMPLE_SOLUTION)
        .isActive(true)
        .build();
    puzzleRepository.save(mediumPuzzle);

    List<Puzzle> easyPuzzles = puzzleRepository.findByDifficultyAndIsActiveTrue(Difficulty.EASY);

    assertThat(easyPuzzles).hasSize(1);
    assertThat(easyPuzzles.get(0).getDifficulty()).isEqualTo(Difficulty.EASY);
  }

  @Test
  void should_excludeInactivePuzzles_when_findingByDifficulty() {
    testPuzzle.setIsActive(false);
    puzzleRepository.save(testPuzzle);

    List<Puzzle> easyPuzzles = puzzleRepository.findByDifficultyAndIsActiveTrue(Difficulty.EASY);

    assertThat(easyPuzzles).isEmpty();
  }

  @Test
  void should_countActivePuzzlesByDifficulty_when_puzzlesExist() {
    puzzleRepository.save(testPuzzle);

    Puzzle anotherEasyPuzzle = Puzzle.builder()
        .difficulty(Difficulty.EASY)
        .initialBoard(SAMPLE_BOARD)
        .solution(SAMPLE_SOLUTION)
        .isActive(true)
        .build();
    puzzleRepository.save(anotherEasyPuzzle);

    long count = puzzleRepository.countByDifficultyAndIsActiveTrue(Difficulty.EASY);

    assertThat(count).isEqualTo(2);
  }

  @Test
  void should_returnZero_when_noActivePuzzlesOfDifficulty() {
    long count = puzzleRepository.countByDifficultyAndIsActiveTrue(Difficulty.EXPERT);

    assertThat(count).isZero();
  }

  @Test
  void should_setCreatedAtAutomatically_when_puzzleSaved() {
    Puzzle savedPuzzle = puzzleRepository.save(testPuzzle);

    assertThat(savedPuzzle.getCreatedAt()).isNotNull();
  }
}
