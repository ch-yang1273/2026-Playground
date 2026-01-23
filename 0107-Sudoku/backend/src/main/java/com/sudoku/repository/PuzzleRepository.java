package com.sudoku.repository;

import com.sudoku.domain.Difficulty;
import com.sudoku.domain.Puzzle;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {

  List<Puzzle> findByDifficultyAndIsActiveTrue(Difficulty difficulty);

  long countByDifficultyAndIsActiveTrue(Difficulty difficulty);
}
