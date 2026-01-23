package com.sudoku.solver;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class SudokuSolver {
  private static final Random RANDOM = new Random();
  private static final int BOARD_SIZE = 9;
  private static final int BOX_SIZE = 3;

  private SudokuSolver() {}

  public static boolean solveNakedSingle(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    boolean madeProgress = false;

    for (int i = 0; i < board.length; i++) {
      if (board[i] == 0) {
        int candidates = getCandidates(board, i);
        if (Integer.bitCount(candidates) == 1) {
          board[i] = Integer.numberOfTrailingZeros(candidates);
          madeProgress = true;
        }
      }
    }

    return madeProgress;
  }

  public static boolean solveNakedPair(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    for (int unit = 0; unit < BOARD_SIZE; unit++) {
      if (findAndApplyNakedPairInRow(board, unit)) return true;
      if (findAndApplyNakedPairInCol(board, unit)) return true;
      if (findAndApplyNakedPairInBox(board, unit)) return true;
    }

    return false;
  }

  private static boolean findAndApplyNakedPairInRow(int[] board, int row) {
    int start = row * BOARD_SIZE;
    int[] indices = new int[BOARD_SIZE];
    int[] candidates = new int[BOARD_SIZE];
    int emptyCount = 0;

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (board[i] == 0) {
        indices[emptyCount] = i;
        candidates[emptyCount] = getCandidates(board, i);
        emptyCount++;
      }
    }

    return findAndApplyNakedPair(board, indices, candidates, emptyCount);
  }

  private static boolean findAndApplyNakedPairInCol(int[] board, int col) {
    int[] indices = new int[BOARD_SIZE];
    int[] candidates = new int[BOARD_SIZE];
    int emptyCount = 0;

    for (int i = col; i < board.length; i += BOARD_SIZE) {
      if (board[i] == 0) {
        indices[emptyCount] = i;
        candidates[emptyCount] = getCandidates(board, i);
        emptyCount++;
      }
    }

    return findAndApplyNakedPair(board, indices, candidates, emptyCount);
  }

  private static boolean findAndApplyNakedPairInBox(int[] board, int box) {
    int boxStartRow = (box / 3) * BOX_SIZE;
    int boxStartCol = (box % 3) * BOX_SIZE;
    int[] indices = new int[BOARD_SIZE];
    int[] candidates = new int[BOARD_SIZE];
    int emptyCount = 0;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int i = r * BOARD_SIZE + c;
        if (board[i] == 0) {
          indices[emptyCount] = i;
          candidates[emptyCount] = getCandidates(board, i);
          emptyCount++;
        }
      }
    }

    return findAndApplyNakedPair(board, indices, candidates, emptyCount);
  }

  private static boolean findAndApplyNakedPair(int[] board, int[] indices, int[] candidates, int count) {
    for (int i = 0; i < count; i++) {
      if (Integer.bitCount(candidates[i]) != 2) continue;

      for (int j = i + 1; j < count; j++) {
        if (candidates[i] != candidates[j]) continue;

        int pairMask = candidates[i];
        for (int k = 0; k < count; k++) {
          if (k == i || k == j) continue;

          if ((candidates[k] & pairMask) != 0 && Integer.bitCount(candidates[k] & ~pairMask) == 1) {
            board[indices[k]] = Integer.numberOfTrailingZeros(candidates[k] & ~pairMask);
            return true;
          }
        }
      }
    }
    return false;
  }

  public static boolean solvePointing(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    for (int box = 0; box < BOARD_SIZE; box++) {
      for (int num = 1; num <= BOARD_SIZE; num++) {
        if (findAndApplyPointingInRow(board, box, num)) return true;
        if (findAndApplyPointingInCol(board, box, num)) return true;
      }
    }

    return false;
  }

  private static boolean findAndApplyPointingInRow(int[] board, int box, int num) {
    int boxStartRow = (box / 3) * BOX_SIZE;
    int boxStartCol = (box % 3) * BOX_SIZE;

    int candidateRow = -1;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int index = r * BOARD_SIZE + c;
        if (board[index] == 0 && canPlace(board, index, num)) {
          if (candidateRow == -1) {
            candidateRow = r;
          } else if (candidateRow != r) {
            return false;
          }
        }
      }
    }

    if (candidateRow == -1) {
      return false;
    }

    for (int c = 0; c < BOARD_SIZE; c++) {
      if (c >= boxStartCol && c < boxStartCol + BOX_SIZE) {
        continue;
      }

      int index = candidateRow * BOARD_SIZE + c;
      if (board[index] == 0 && canPlace(board, index, num)) {
        int candidates = getCandidates(board, index);
        int candidatesAfterElimination = candidates & ~(1 << num);
        if (Integer.bitCount(candidatesAfterElimination) == 1) {
          board[index] = Integer.numberOfTrailingZeros(candidatesAfterElimination);
          return true;
        }
      }
    }

    return false;
  }

  private static boolean findAndApplyPointingInCol(int[] board, int box, int num) {
    int boxStartRow = (box / 3) * BOX_SIZE;
    int boxStartCol = (box % 3) * BOX_SIZE;

    int candidateCol = -1;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int index = r * BOARD_SIZE + c;
        if (board[index] == 0 && canPlace(board, index, num)) {
          if (candidateCol == -1) {
            candidateCol = c;
          } else if (candidateCol != c) {
            return false;
          }
        }
      }
    }

    if (candidateCol == -1) {
      return false;
    }

    for (int r = 0; r < BOARD_SIZE; r++) {
      if (r >= boxStartRow && r < boxStartRow + BOX_SIZE) {
        continue;
      }

      int index = r * BOARD_SIZE + candidateCol;
      if (board[index] == 0 && canPlace(board, index, num)) {
        int candidates = getCandidates(board, index);
        int candidatesAfterElimination = candidates & ~(1 << num);
        if (Integer.bitCount(candidatesAfterElimination) == 1) {
          board[index] = Integer.numberOfTrailingZeros(candidatesAfterElimination);
          return true;
        }
      }
    }

    return false;
  }

  public static boolean solveHiddenSingle(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    for (int num = 1; num <= BOARD_SIZE; num++) {
      for (int i = 0; i < BOARD_SIZE; i++) {
        int rowHiddenIndex = findHiddenSingleInRow(board, i, num);
        if (rowHiddenIndex != -1) {
          board[rowHiddenIndex] = num;
          return true;
        }

        int colHiddenIndex = findHiddenSingleInCol(board, i, num);
        if (colHiddenIndex != -1) {
          board[colHiddenIndex] = num;
          return true;
        }

        int boxHiddenIndex = findHiddenSingleInBox(board, i, num);
        if (boxHiddenIndex != -1) {
          board[boxHiddenIndex] = num;
          return true;
        }
      }
    }

    return false;
  }

  private static int findHiddenSingleInRow(int[] board, int row, int num) {
    int start = row * BOARD_SIZE;
    int count = 0;
    int index = -1;

    for (int i = start; i < start + BOARD_SIZE; i++) {
      if (board[i] == 0 && canPlace(board, i, num)) {
        count++;
        index = i;
      }
    }

    return count == 1 ? index : -1;
  }

  private static int findHiddenSingleInCol(int[] board, int col, int num) {
    int count = 0;
    int index = -1;

    for (int i = col; i < board.length; i += BOARD_SIZE) {
      if (board[i] == 0 && canPlace(board, i, num)) {
        count++;
        index = i;
      }
    }

    return count == 1 ? index : -1;
  }

  private static int findHiddenSingleInBox(int[] board, int box, int num) {
    int boxStartRow = (box / 3) * BOX_SIZE;
    int boxStartCol = (box % 3) * BOX_SIZE;
    int count = 0;
    int index = -1;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int i = r * BOARD_SIZE + c;
        if (board[i] == 0 && canPlace(board, i, num)) {
          count++;
          index = i;
        }
      }
    }

    return count == 1 ? index : -1;
  }

  private static boolean canPlace(int[] board, int index, int num) {
    int row = index / BOARD_SIZE;
    int col = index % BOARD_SIZE;

    for (int i = 0; i < BOARD_SIZE; i++) {
      if (board[row * BOARD_SIZE + i] == num) return false;
      if (board[i * BOARD_SIZE + col] == num) return false;
    }

    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        if (board[r * BOARD_SIZE + c] == num) return false;
      }
    }

    return true;
  }

  private static int getCandidates(int[] board, int index) {
    int row = index / BOARD_SIZE;
    int col = index % BOARD_SIZE;

    int usedValues = 0;

    for (int i = 0; i < BOARD_SIZE; i++) {
      int rowIndex = row * BOARD_SIZE + i;
      int colIndex = i * BOARD_SIZE + col;
      if (board[rowIndex] != 0) usedValues |= (1 << board[rowIndex]);
      if (board[colIndex] != 0) usedValues |= (1 << board[colIndex]);
    }

    int boxStartRow = (row / BOX_SIZE) * BOX_SIZE;
    int boxStartCol = (col / BOX_SIZE) * BOX_SIZE;

    for (int r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
      for (int c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
        int boxIndex = r * BOARD_SIZE + c;
        if (board[boxIndex] != 0) usedValues |= (1 << board[boxIndex]);
      }
    }

    return ~usedValues & 0x3FE;
  }

  public static boolean solveBacktracking(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }
    return solveBacktrackingRecursive(board);
  }

  private static boolean solveBacktrackingRecursive(int[] board) {
    int emptyIndex = findEmptyCellWithMinCandidates(board);

    if (emptyIndex == -1) {
      return true;
    }

    int candidates = getCandidates(board, emptyIndex);

    if (candidates == 0) {
      return false;
    }

    for (int num = 1; num <= BOARD_SIZE; num++) {
      if ((candidates & (1 << num)) != 0) {
        board[emptyIndex] = num;

        if (solveBacktrackingRecursive(board)) {
          return true;
        }

        board[emptyIndex] = 0;
      }
    }

    return false;
  }

  private static int findEmptyCellWithMinCandidates(int[] board) {
    int minCandidates = BOARD_SIZE + 1;
    int minIndex = -1;

    for (int i = 0; i < board.length; i++) {
      if (board[i] == 0) {
        int candidateCount = Integer.bitCount(getCandidates(board, i));

        if (candidateCount == 0) {
          return i;
        }

        if (candidateCount < minCandidates) {
          minCandidates = candidateCount;
          minIndex = i;

          if (minCandidates == 1) {
            return minIndex;
          }
        }
      }
    }

    return minIndex;
  }

  public static boolean hasUniqueSolution(int[] board) {
    if (board == null || board.length != BOARD_SIZE * BOARD_SIZE) {
      return false;
    }

    int[] boardCopy = board.clone();
    int[] solutionCount = new int[1];

    countSolutions(boardCopy, solutionCount, 2);

    return solutionCount[0] == 1;
  }

  private static void countSolutions(int[] board, int[] count, int maxCount) {
    if (count[0] >= maxCount) {
      return;
    }

    int emptyIndex = findEmptyCellWithMinCandidates(board);

    if (emptyIndex == -1) {
      count[0]++;
      return;
    }

    int candidates = getCandidates(board, emptyIndex);

    if (candidates == 0) {
      return;
    }

    for (int num = 1; num <= BOARD_SIZE && count[0] < maxCount; num++) {
      if ((candidates & (1 << num)) != 0) {
        board[emptyIndex] = num;

        countSolutions(board, count, maxCount);

        board[emptyIndex] = 0;
      }
    }
  }

  public static int[] generateCompleteBoard() {
    int[] board = new int[BOARD_SIZE * BOARD_SIZE];
    generateCompleteBoardRecursive(board);
    return board;
  }

  private static boolean generateCompleteBoardRecursive(int[] board) {
    int emptyIndex = -1;
    for (int i = 0; i < board.length; i++) {
      if (board[i] == 0) {
        emptyIndex = i;
        break;
      }
    }

    if (emptyIndex == -1) {
      return true;
    }

    List<Integer> candidates = getCandidatesList(board, emptyIndex);
    Collections.shuffle(candidates, RANDOM);

    for (int num : candidates) {
      board[emptyIndex] = num;
      if (generateCompleteBoardRecursive(board)) {
        return true;
      }
      board[emptyIndex] = 0;
    }

    return false;
  }

  private static List<Integer> getCandidatesList(int[] board, int index) {
    List<Integer> candidates = new ArrayList<>();
    int candidateMask = getCandidates(board, index);
    for (int num = 1; num <= BOARD_SIZE; num++) {
      if ((candidateMask & (1 << num)) != 0) {
        candidates.add(num);
      }
    }
    return candidates;
  }

  public static int[] removeCells(int[] board, int cellsToRemove) {
    int[] result = board.clone();

    List<Integer> indices = new ArrayList<>();
    for (int i = 0; i < result.length; i++) {
      if (result[i] != 0) {
        indices.add(i);
      }
    }
    Collections.shuffle(indices, RANDOM);

    int removed = 0;
    for (int index : indices) {
      if (removed >= cellsToRemove) {
        break;
      }

      int backup = result[index];
      result[index] = 0;

      if (hasUniqueSolution(result)) {
        removed++;
      } else {
        result[index] = backup;
      }
    }

    return result;
  }

  public static String getDifficulty(int[] board) {
    int[] copy = board.clone();

    boolean usedHiddenSingle = false;
    boolean usedAdvancedTechnique = false;

    while (hasEmptyCell(copy)) {
      if (solveNakedSingle(copy)) {
        continue;
      }

      if (solveHiddenSingle(copy)) {
        usedHiddenSingle = true;
        continue;
      }

      if (solveNakedPair(copy) || solvePointing(copy)) {
        usedAdvancedTechnique = true;
        continue;
      }

      return "EXPERT";
    }

    if (usedAdvancedTechnique) {
      return "HARD";
    }
    if (usedHiddenSingle) {
      return "MEDIUM";
    }
    return "EASY";
  }

  private static boolean hasEmptyCell(int[] board) {
    for (int cell : board) {
      if (cell == 0) {
        return true;
      }
    }
    return false;
  }

  public static int[] generatePuzzle(String difficulty) {
    int minRemove;
    int maxRemove;

    switch (difficulty) {
      case "EASY":
        minRemove = 35;
        maxRemove = 45;
        break;
      case "MEDIUM":
        minRemove = 45;
        maxRemove = 52;
        break;
      case "HARD":
        minRemove = 52;
        maxRemove = 58;
        break;
      case "EXPERT":
        minRemove = 58;
        maxRemove = 64;
        break;
      default:
        return null;
    }

    for (int attempt = 0; attempt < 10; attempt++) {
      int[] completeBoard = generateCompleteBoard();
      int cellsToRemove = minRemove + RANDOM.nextInt(maxRemove - minRemove + 1);
      int[] puzzle = removeCells(completeBoard, cellsToRemove);

      if (getDifficulty(puzzle).equals(difficulty)) {
        return puzzle;
      }
    }

    return null;
  }
}
