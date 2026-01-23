package com.sudoku.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.sudoku.domain.Difficulty;
import com.sudoku.domain.GameRecord;
import com.sudoku.domain.Puzzle;
import com.sudoku.domain.Role;
import com.sudoku.domain.User;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
class GameRecordRepositoryTest {

  @Autowired
  private GameRecordRepository gameRecordRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PuzzleRepository puzzleRepository;

  private static final String SAMPLE_BOARD =
      "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
  private static final String SAMPLE_SOLUTION =
      "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

  private User testUser;
  private Puzzle testPuzzle;

  @BeforeEach
  void setUp() {
    testUser = User.builder()
        .email("player@example.com")
        .password("password123")
        .nickname("player")
        .role(Role.USER)
        .build();
    testUser = userRepository.save(testUser);

    testPuzzle = Puzzle.builder()
        .difficulty(Difficulty.EASY)
        .initialBoard(SAMPLE_BOARD)
        .solution(SAMPLE_SOLUTION)
        .isActive(true)
        .build();
    testPuzzle = puzzleRepository.save(testPuzzle);
  }

  @Test
  void should_saveGameRecord_when_validRecordProvided() {
    GameRecord gameRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .completionTime(300)
        .hintCount(2)
        .isCompleted(true)
        .build();

    GameRecord savedRecord = gameRecordRepository.save(gameRecord);

    assertThat(savedRecord.getId()).isNotNull();
    assertThat(savedRecord.getUser().getId()).isEqualTo(testUser.getId());
    assertThat(savedRecord.getPuzzle().getId()).isEqualTo(testPuzzle.getId());
    assertThat(savedRecord.getCompletionTime()).isEqualTo(300);
    assertThat(savedRecord.getHintCount()).isEqualTo(2);
    assertThat(savedRecord.getIsCompleted()).isTrue();
  }

  @Test
  void should_saveGameRecordWithoutUser_when_anonymousPlay() {
    GameRecord gameRecord = GameRecord.builder()
        .user(null)
        .puzzle(testPuzzle)
        .completionTime(600)
        .isCompleted(true)
        .build();

    GameRecord savedRecord = gameRecordRepository.save(gameRecord);

    assertThat(savedRecord.getId()).isNotNull();
    assertThat(savedRecord.getUser()).isNull();
    assertThat(savedRecord.getPuzzle().getId()).isEqualTo(testPuzzle.getId());
  }

  @Test
  void should_findRecordsByUserIdOrderedByCreatedAtDesc_when_userHasRecords() {
    GameRecord record1 = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .completionTime(300)
        .isCompleted(true)
        .build();
    gameRecordRepository.save(record1);

    GameRecord record2 = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .completionTime(400)
        .isCompleted(false)
        .build();
    gameRecordRepository.save(record2);

    List<GameRecord> records =
        gameRecordRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId());

    assertThat(records).hasSize(2);
  }

  @Test
  void should_returnEmptyList_when_userHasNoRecords() {
    List<GameRecord> records = gameRecordRepository.findByUserIdOrderByCreatedAtDesc(999L);

    assertThat(records).isEmpty();
  }

  @Test
  void should_countCompletedRecordsByUserId_when_userHasCompletedGames() {
    GameRecord completedRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .completionTime(300)
        .isCompleted(true)
        .build();
    gameRecordRepository.save(completedRecord);

    GameRecord incompleteRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .isCompleted(false)
        .build();
    gameRecordRepository.save(incompleteRecord);

    long completedCount = gameRecordRepository.countByUserIdAndIsCompletedTrue(testUser.getId());

    assertThat(completedCount).isEqualTo(1);
  }

  @Test
  void should_returnZero_when_userHasNoCompletedGames() {
    GameRecord incompleteRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .isCompleted(false)
        .build();
    gameRecordRepository.save(incompleteRecord);

    long completedCount = gameRecordRepository.countByUserIdAndIsCompletedTrue(testUser.getId());

    assertThat(completedCount).isZero();
  }

  @Test
  void should_setCreatedAtAutomatically_when_gameRecordSaved() {
    GameRecord gameRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .build();

    GameRecord savedRecord = gameRecordRepository.save(gameRecord);

    assertThat(savedRecord.getCreatedAt()).isNotNull();
  }

  @Test
  void should_useDefaultValues_when_notSpecified() {
    GameRecord gameRecord = GameRecord.builder()
        .user(testUser)
        .puzzle(testPuzzle)
        .build();

    GameRecord savedRecord = gameRecordRepository.save(gameRecord);

    assertThat(savedRecord.getHintCount()).isZero();
    assertThat(savedRecord.getIsCompleted()).isFalse();
  }
}
