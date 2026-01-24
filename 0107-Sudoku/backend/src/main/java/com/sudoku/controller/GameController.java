package com.sudoku.controller;

import com.sudoku.domain.Difficulty;
import com.sudoku.dto.GameCompleteRequest;
import com.sudoku.dto.GameCompleteResponse;
import com.sudoku.dto.GameGiveUpResponse;
import com.sudoku.dto.GameHintRequest;
import com.sudoku.dto.GameHintResponse;
import com.sudoku.dto.GameStartResponse;
import com.sudoku.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

  private final GameService gameService;

  @GetMapping("/start")
  public ResponseEntity<GameStartResponse> startGame(@RequestParam Difficulty difficulty) {
    GameStartResponse response = gameService.startGame(difficulty);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{id}/complete")
  public ResponseEntity<GameCompleteResponse> completeGame(
      @PathVariable Long id,
      @Valid @RequestBody GameCompleteRequest request) {
    GameCompleteResponse response = gameService.completeGame(id, request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{id}/give-up")
  public ResponseEntity<GameGiveUpResponse> giveUpGame(@PathVariable Long id) {
    GameGiveUpResponse response = gameService.giveUpGame(id);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{id}/hint")
  public ResponseEntity<GameHintResponse> getHint(
      @PathVariable Long id,
      @Valid @RequestBody GameHintRequest request) {
    GameHintResponse response = gameService.getHint(id, request);
    return ResponseEntity.ok(response);
  }
}
