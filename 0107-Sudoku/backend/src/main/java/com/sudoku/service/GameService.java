package com.sudoku.service;

import com.sudoku.domain.Difficulty;
import com.sudoku.domain.GameRecord;
import com.sudoku.domain.Puzzle;
import com.sudoku.domain.User;
import com.sudoku.dto.GameCompleteRequest;
import com.sudoku.dto.GameCompleteResponse;
import com.sudoku.dto.GameGiveUpResponse;
import com.sudoku.dto.GameHintRequest;
import com.sudoku.dto.GameHintResponse;
import com.sudoku.dto.GameStartResponse;
import com.sudoku.exception.GameAlreadyCompletedException;
import com.sudoku.exception.GameNotFoundException;
import com.sudoku.exception.HintLimitExceededException;
import com.sudoku.exception.InvalidBoardException;
import com.sudoku.exception.NoPuzzleAvailableException;
import com.sudoku.repository.GameRecordRepository;
import com.sudoku.repository.PuzzleRepository;
import com.sudoku.repository.UserRepository;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GameService {

  private final PuzzleRepository puzzleRepository;
  private final GameRecordRepository gameRecordRepository;
  private final UserRepository userRepository;
  private final Random random = new Random();

  private static final int HINT_LIMIT_EASY = 5;
  private static final int HINT_LIMIT_MEDIUM = 3;
  private static final int HINT_LIMIT_HARD = 2;
  private static final int HINT_LIMIT_EXPERT = 1;

  @Transactional
  public GameStartResponse startGame(Difficulty difficulty) {
    long puzzleCount = puzzleRepository.countByDifficultyAndIsActiveTrue(difficulty);

    if (puzzleCount == 0) {
      throw new NoPuzzleAvailableException("No puzzles available for difficulty: " + difficulty);
    }

    int randomOffset = random.nextInt((int) puzzleCount);
    Page<Puzzle> puzzlePage = puzzleRepository.findByDifficultyAndIsActiveTrue(
        difficulty, PageRequest.of(randomOffset, 1));
    Puzzle selectedPuzzle = puzzlePage.getContent().get(0);

    User currentUser = getCurrentAuthenticatedUser();

    GameRecord gameRecord = GameRecord.builder()
        .puzzle(selectedPuzzle)
        .user(currentUser)
        .build();

    GameRecord savedGameRecord = gameRecordRepository.save(gameRecord);

    return new GameStartResponse(
        savedGameRecord.getId(),
        selectedPuzzle.getInitialBoard(),
        difficulty.name(),
        getHintLimit(difficulty)
    );
  }

  private User getCurrentAuthenticatedUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()
        || "anonymousUser".equals(authentication.getPrincipal())) {
      return null;
    }
    String email = authentication.getName();
    return userRepository.findByEmail(email).orElse(null);
  }

  private int getHintLimit(Difficulty difficulty) {
    return switch (difficulty) {
      case EASY -> HINT_LIMIT_EASY;
      case MEDIUM -> HINT_LIMIT_MEDIUM;
      case HARD -> HINT_LIMIT_HARD;
      case EXPERT -> HINT_LIMIT_EXPERT;
    };
  }

  @Transactional
  public GameCompleteResponse completeGame(Long gameId, GameCompleteRequest request) {
    GameRecord gameRecord = gameRecordRepository.findById(gameId)
        .orElseThrow(() -> new GameNotFoundException("Game not found with id: " + gameId));

    if (gameRecord.getIsCompleted()) {
      throw new GameAlreadyCompletedException("Game already completed with id: " + gameId);
    }

    String solution = gameRecord.getPuzzle().getSolution();
    if (!solution.equals(request.getFinalBoard())) {
      throw new InvalidBoardException("Submitted board does not match the solution");
    }

    gameRecord.setIsCompleted(true);
    gameRecord.setCompletionTime(request.getCompletionTime());
    gameRecordRepository.save(gameRecord);

    boolean isRankingEligible = gameRecord.getUser() != null && gameRecord.getHintCount() == 0;

    return new GameCompleteResponse(
        gameRecord.getId(),
        gameRecord.getCompletionTime(),
        gameRecord.getHintCount(),
        isRankingEligible
    );
  }

  @Transactional(readOnly = true)
  public GameGiveUpResponse giveUpGame(Long gameId) {
    GameRecord gameRecord = gameRecordRepository.findById(gameId)
        .orElseThrow(() -> new GameNotFoundException("Game not found with id: " + gameId));

    if (gameRecord.getIsCompleted()) {
      throw new GameAlreadyCompletedException("Game already completed with id: " + gameId);
    }

    String solution = gameRecord.getPuzzle().getSolution();

    return new GameGiveUpResponse(gameRecord.getId(), solution);
  }

  @Transactional
  public GameHintResponse getHint(Long gameId, GameHintRequest request) {
    GameRecord gameRecord = gameRecordRepository.findById(gameId)
        .orElseThrow(() -> new GameNotFoundException("Game not found with id: " + gameId));

    if (gameRecord.getIsCompleted()) {
      throw new GameAlreadyCompletedException("Game already completed with id: " + gameId);
    }

    Difficulty difficulty = gameRecord.getPuzzle().getDifficulty();
    int hintLimit = getHintLimit(difficulty);

    if (gameRecord.getHintCount() >= hintLimit) {
      throw new HintLimitExceededException("Hint limit exceeded for game: " + gameId);
    }

    String currentBoard = request.getCurrentBoard();
    String solution = gameRecord.getPuzzle().getSolution();

    int emptyIndex = findFirstEmptyCell(currentBoard);
    if (emptyIndex == -1) {
      throw new InvalidBoardException("No empty cells to hint");
    }

    int row = emptyIndex / 9;
    int col = emptyIndex % 9;
    int value = Character.getNumericValue(solution.charAt(emptyIndex));

    gameRecord.setHintCount(gameRecord.getHintCount() + 1);
    gameRecordRepository.save(gameRecord);

    int remainingHints = hintLimit - gameRecord.getHintCount();

    return new GameHintResponse(row, col, value, remainingHints);
  }

  private int findFirstEmptyCell(String board) {
    for (int i = 0; i < board.length(); i++) {
      if (board.charAt(i) == '0') {
        return i;
      }
    }
    return -1;
  }
}
