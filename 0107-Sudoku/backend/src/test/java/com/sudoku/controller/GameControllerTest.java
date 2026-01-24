package com.sudoku.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudoku.domain.Difficulty;
import com.sudoku.domain.GameRecord;
import com.sudoku.domain.Puzzle;
import com.sudoku.domain.User;
import com.sudoku.dto.GameCompleteRequest;
import com.sudoku.dto.GameHintRequest;
import com.sudoku.repository.GameRecordRepository;
import com.sudoku.repository.PuzzleRepository;
import com.sudoku.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private PuzzleRepository puzzleRepository;

  @Autowired
  private GameRecordRepository gameRecordRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ObjectMapper objectMapper;

  private static final String VALID_SOLUTION =
      "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
  private static final String INVALID_SOLUTION =
      "111111111111111111111111111111111111111111111111111111111111111111111111111111111";

  @BeforeEach
  void setUp() {
    gameRecordRepository.deleteAll();
    puzzleRepository.deleteAll();
    userRepository.deleteAll();
  }

  @Test
  void should_returnGameWithPuzzle_when_startGameWithEasyDifficulty() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.EASY);
    puzzleRepository.save(puzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").isNumber())
        .andExpect(jsonPath("$.puzzle").value(puzzle.getInitialBoard()))
        .andExpect(jsonPath("$.difficulty").value("EASY"))
        .andExpect(jsonPath("$.hintLimit").value(5));
  }

  @Test
  void should_returnHintLimit3_when_startGameWithMediumDifficulty() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.MEDIUM);
    puzzleRepository.save(puzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "MEDIUM"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").isNumber())
        .andExpect(jsonPath("$.difficulty").value("MEDIUM"))
        .andExpect(jsonPath("$.hintLimit").value(3));
  }

  @Test
  void should_returnHintLimit2_when_startGameWithHardDifficulty() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.HARD);
    puzzleRepository.save(puzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "HARD"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").isNumber())
        .andExpect(jsonPath("$.difficulty").value("HARD"))
        .andExpect(jsonPath("$.hintLimit").value(2));
  }

  @Test
  void should_returnHintLimit1_when_startGameWithExpertDifficulty() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.EXPERT);
    puzzleRepository.save(puzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EXPERT"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").isNumber())
        .andExpect(jsonPath("$.difficulty").value("EXPERT"))
        .andExpect(jsonPath("$.hintLimit").value(1));
  }

  @Test
  void should_returnNotFound_when_noPuzzlesAvailableForDifficulty() throws Exception {
    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("No puzzles available for difficulty: EASY"));
  }

  @Test
  void should_returnBadRequest_when_invalidDifficultyProvided() throws Exception {
    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "INVALID"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void should_returnBadRequest_when_difficultyNotProvided() throws Exception {
    mockMvc.perform(get("/api/games/start"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void should_createGameRecord_when_startGame() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.EASY);
    puzzleRepository.save(puzzle);

    long initialCount = gameRecordRepository.count();

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isOk());

    long finalCount = gameRecordRepository.count();
    assert finalCount == initialCount + 1;
  }

  @Test
  void should_notIncludeSolutionInResponse_when_startGame() throws Exception {
    Puzzle puzzle = createTestPuzzle(Difficulty.EASY);
    puzzleRepository.save(puzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.solution").doesNotExist());
  }

  @Test
  void should_selectRandomPuzzle_when_multiplePuzzlesExist() throws Exception {
    createTestPuzzle(Difficulty.EASY);
    createTestPuzzle(Difficulty.EASY);
    puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    puzzleRepository.save(createTestPuzzle(Difficulty.EASY));

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").isNumber());
  }

  @Test
  void should_onlySelectActivePuzzles_when_inactivePuzzlesExist() throws Exception {
    Puzzle activePuzzle = createTestPuzzle(Difficulty.EASY);
    activePuzzle.setIsActive(true);
    puzzleRepository.save(activePuzzle);

    Puzzle inactivePuzzle = createTestPuzzle(Difficulty.EASY);
    inactivePuzzle.setIsActive(false);
    puzzleRepository.save(inactivePuzzle);

    mockMvc.perform(get("/api/games/start")
            .param("difficulty", "EASY"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.puzzle").value(activePuzzle.getInitialBoard()));
  }

  private Puzzle createTestPuzzle(Difficulty difficulty) {
    return Puzzle.builder()
        .difficulty(difficulty)
        .initialBoard("530070000600195000098000060800060003400803001700020006060000280000419005000080079")
        .solution("534678912672195348198342567859761423426853791713924856961537284287419635345286179")
        .isActive(true)
        .build();
  }

  @Test
  void should_completeGameSuccessfully_when_validBoardProvided() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(false)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").value(gameRecord.getId()))
        .andExpect(jsonPath("$.completionTime").value(120))
        .andExpect(jsonPath("$.hintCount").value(0))
        .andExpect(jsonPath("$.isRankingEligible").value(false));

    GameRecord updatedRecord = gameRecordRepository.findById(gameRecord.getId()).orElseThrow();
    assert updatedRecord.getIsCompleted();
    assert updatedRecord.getCompletionTime() == 120;
  }

  @Test
  void should_returnNotFound_when_gameNotFound() throws Exception {
    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", 99999L)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Game not found with id: 99999"));
  }

  @Test
  void should_returnBadRequest_when_gameAlreadyCompleted() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(true)
        .completionTime(100)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Game already completed with id: " + gameRecord.getId()));
  }

  @Test
  void should_returnBadRequest_when_boardDoesNotMatchSolution() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(false)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(INVALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Submitted board does not match the solution"));
  }

  @Test
  void should_beRankingEligible_when_noHintsUsedAndUserLoggedIn() throws Exception {
    User user = userRepository.save(User.builder()
        .email("test@example.com")
        .password("password123")
        .nickname("testuser")
        .build());

    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .user(user)
        .hintCount(0)
        .isCompleted(false)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.isRankingEligible").value(true));
  }

  @Test
  void should_notBeRankingEligible_when_hintsUsed() throws Exception {
    User user = userRepository.save(User.builder()
        .email("test2@example.com")
        .password("password123")
        .nickname("testuser2")
        .build());

    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .user(user)
        .hintCount(2)
        .isCompleted(false)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.hintCount").value(2))
        .andExpect(jsonPath("$.isRankingEligible").value(false));
  }

  @Test
  void should_notBeRankingEligible_when_userNotLoggedIn() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .user(null)
        .hintCount(0)
        .isCompleted(false)
        .build());

    GameCompleteRequest request = new GameCompleteRequest(VALID_SOLUTION, 120);

    mockMvc.perform(post("/api/games/{id}/complete", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.isRankingEligible").value(false));
  }

  @Test
  void should_returnSolution_when_giveUpGame() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(false)
        .build());

    mockMvc.perform(post("/api/games/{id}/give-up", gameRecord.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.gameId").value(gameRecord.getId()))
        .andExpect(jsonPath("$.solution").value(VALID_SOLUTION));

    GameRecord updatedRecord = gameRecordRepository.findById(gameRecord.getId()).orElseThrow();
    assert !updatedRecord.getIsCompleted();
  }

  @Test
  void should_returnNotFound_when_giveUpGameNotFound() throws Exception {
    mockMvc.perform(post("/api/games/{id}/give-up", 99999L))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Game not found with id: 99999"));
  }

  @Test
  void should_returnBadRequest_when_giveUpGameAlreadyCompleted() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(true)
        .completionTime(100)
        .build());

    mockMvc.perform(post("/api/games/{id}/give-up", gameRecord.getId()))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Game already completed with id: " + gameRecord.getId()));
  }

  @Test
  void should_returnHint_when_getHintSuccessfully() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(false)
        .build());

    String currentBoard = "030070000600195000098000060800060003400803001700020006060000280000419005000080079";
    GameHintRequest request = new GameHintRequest(currentBoard);

    mockMvc.perform(post("/api/games/{id}/hint", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.row").value(0))
        .andExpect(jsonPath("$.col").value(0))
        .andExpect(jsonPath("$.value").value(5))
        .andExpect(jsonPath("$.remainingHints").value(4));

    GameRecord updatedRecord = gameRecordRepository.findById(gameRecord.getId()).orElseThrow();
    assert updatedRecord.getHintCount() == 1;
  }

  @Test
  void should_decrementRemainingHints_when_multipleHintsUsed() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(3)
        .isCompleted(false)
        .build());

    String currentBoard = "030070000600195000098000060800060003400803001700020006060000280000419005000080079";
    GameHintRequest request = new GameHintRequest(currentBoard);

    mockMvc.perform(post("/api/games/{id}/hint", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.remainingHints").value(1));

    GameRecord updatedRecord = gameRecordRepository.findById(gameRecord.getId()).orElseThrow();
    assert updatedRecord.getHintCount() == 4;
  }

  @Test
  void should_returnNotFound_when_getHintForNonExistentGame() throws Exception {
    String currentBoard = "030070000600195000098000060800060003400803001700020006060000280000419005000080079";
    GameHintRequest request = new GameHintRequest(currentBoard);

    mockMvc.perform(post("/api/games/{id}/hint", 99999L)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Game not found with id: 99999"));
  }

  @Test
  void should_returnBadRequest_when_getHintForCompletedGame() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(true)
        .completionTime(100)
        .build());

    String currentBoard = "030070000600195000098000060800060003400803001700020006060000280000419005000080079";
    GameHintRequest request = new GameHintRequest(currentBoard);

    mockMvc.perform(post("/api/games/{id}/hint", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Game already completed with id: " + gameRecord.getId()));
  }

  @Test
  void should_returnBadRequest_when_hintLimitExceeded() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(5)
        .isCompleted(false)
        .build());

    String currentBoard = "030070000600195000098000060800060003400803001700020006060000280000419005000080079";
    GameHintRequest request = new GameHintRequest(currentBoard);

    mockMvc.perform(post("/api/games/{id}/hint", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Hint limit exceeded for game: " + gameRecord.getId()));
  }

  @Test
  void should_returnBadRequest_when_noEmptyCellsRemain() throws Exception {
    Puzzle puzzle = puzzleRepository.save(createTestPuzzle(Difficulty.EASY));
    GameRecord gameRecord = gameRecordRepository.save(GameRecord.builder()
        .puzzle(puzzle)
        .hintCount(0)
        .isCompleted(false)
        .build());

    GameHintRequest request = new GameHintRequest(VALID_SOLUTION);

    mockMvc.perform(post("/api/games/{id}/hint", gameRecord.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("No empty cells to hint"));
  }
}
