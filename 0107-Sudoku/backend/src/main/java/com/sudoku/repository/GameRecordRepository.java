package com.sudoku.repository;

import com.sudoku.domain.GameRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {

  List<GameRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

  long countByUserIdAndIsCompletedTrue(Long userId);
}
