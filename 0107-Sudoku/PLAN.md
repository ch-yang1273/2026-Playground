# Sudoku TDD Project - Development Plan

## 📋 Project Overview

**Goal**: Build a TDD-based Sudoku web application where users play difficulty-based puzzles and admins manage the puzzle pool.

**Tech Stack**:
- **Frontend**: Vue.js + TypeScript + Vitest + Pinia
- **Backend**: Spring Boot + Java + JUnit + MariaDB
- **E2E**: Playwright
- **Auth**: JWT

---

## 📐 Phase 1: Project Initial Setup

### Frontend (Vue.js)
- [x] Create Vue.js + TypeScript project
- [x] Setup Vitest for testing
- [x] Configure ESLint & Prettier
- [x] Install and setup Pinia for state management

### Backend (Spring Boot)
- [x] Create Spring Boot project
- [x] Setup JUnit & Checkstyle
- [x] Configure MariaDB connection
- [x] Setup JPA/Hibernate

### E2E (Playwright)
- [x] Install Playwright
- [x] Configure test environment

---

## 🧮 Phase 2: Sudoku Core Logic (Backend - Pure Functions)

**TDD Approach**: Write tests first, then implement

### 2.1 Board Validation
- [ ] `isValidBoard()` - Validate entire board
- [ ] `isValidCell()` - Validate specific cell
- [ ] `findDuplicates()` - Find duplicates in row/col/box
- [ ] `isComplete()` - Check if board is complete

### 2.2 Solving Algorithms (for difficulty classification)
- [ ] `solveNakedSingle()` - Naked Single technique
- [ ] `solveHiddenSingle()` - Hidden Single technique
- [ ] `solveNakedPair()` - Naked Pair technique
- [ ] `solvePointing()` - Pointing technique
- [ ] `solveBacktracking()` - Backtracking algorithm
- [ ] `hasUniqueSolution()` - Verify unique solution

### 2.3 Generation Algorithms
- [ ] `generateCompleteBoard()` - Generate complete valid board
- [ ] `removeCells()` - Remove cells while maintaining unique solution
- [ ] `getDifficulty()` - Classify puzzle difficulty
- [ ] `generatePuzzle()` - Generate puzzle by difficulty

---

## 🗄️ Phase 3: Database & Entities (Backend)

### 3.1 Database Schema
- [ ] Create users table
- [ ] Create puzzles table
- [ ] Create game_records table

### 3.2 JPA Entities
- [ ] User entity (id, email, password, nickname, role, timestamps)
- [ ] Puzzle entity (id, difficulty, initial_board, solution, is_active, timestamp)
- [ ] GameRecord entity (id, user_id, puzzle_id, completion_time, hint_count, is_completed, timestamp)

### 3.3 Repositories
- [ ] UserRepository
- [ ] PuzzleRepository
- [ ] GameRecordRepository

---

## 🔐 Phase 4: Authentication API (Backend)

### Tests & Implementation
- [ ] POST /api/auth/signup - User registration
- [ ] POST /api/auth/login - User login
- [ ] POST /api/auth/logout - User logout
- [ ] JWT token generation & validation
- [ ] Spring Security configuration

---

## 🎮 Phase 5: Game API (Backend)

### Tests & Implementation
- [ ] GET /api/games/start - Assign random puzzle by difficulty
- [ ] POST /api/games/{id}/complete - Complete game
- [ ] POST /api/games/{id}/give-up - Give up game
- [ ] Hint provision logic
- [ ] Hint count limits by difficulty (Easy: 5, Medium: 3, Hard: 2, Expert: 1)

---

## 🏆 Phase 6: Ranking & User API (Backend)

### Tests & Implementation
- [ ] GET /api/rankings - Get rankings by difficulty
- [ ] GET /api/users/me - Get current user info
- [ ] GET /api/users/me/records - Get user records
- [ ] Ranking eligibility validation (members only, no hints used)

---

## 👨‍💼 Phase 7: Admin API (Backend)

### Tests & Implementation
- [ ] GET /api/admin/puzzles - List puzzles
- [ ] POST /api/admin/puzzles/generate - Batch generate puzzles
- [ ] PATCH /api/admin/puzzles/{id} - Update puzzle (activate/deactivate)
- [ ] DELETE /api/admin/puzzles/{id} - Delete puzzle
- [ ] GET /api/admin/records - Get all records
- [ ] GET /api/admin/statistics - Get statistics

---

## 🎨 Phase 8: Frontend Core Components

### 8.1 Board & Input
- [ ] SudokuBoard component
- [ ] Cell component
- [ ] NumberPad component
- [ ] Keyboard input handling

### 8.2 Memo & Hint
- [ ] Memo mode toggle
- [ ] Candidate number management
- [ ] Hint display

### 8.3 State Management (Undo/Redo)
- [ ] Undo/Redo stack
- [ ] Timer management
- [ ] Game state

### 8.4 UI/UX
- [ ] Difficulty selection screen
- [ ] Game screen
- [ ] Completion screen
- [ ] Ranking screen
- [ ] My page
- [ ] Admin dashboard

---

## 🧪 Phase 9: E2E Tests

### User Scenarios
- [ ] Play game (all difficulties)
- [ ] Signup & login
- [ ] Ranking registration
- [ ] Memo & hint usage

### Admin Scenarios
- [ ] Generate puzzles
- [ ] Manage puzzles
- [ ] View statistics

---

## 🚀 Suggested Execution Order

### To MVP (Weeks 1-3)
1. **Week 1**: Phase 1 + Phase 2 (Core logic)
2. **Week 2**: Phase 3 + Phase 4 + Phase 5 (DB + Auth + Game API)
3. **Week 3**: Phase 6 + Phase 8.1-8.3 (Ranking + Frontend core)

### To Completion (Weeks 4-5)
- Remaining phases in order

---

## 📊 Puzzle Pool Requirements

Pre-generate puzzles by difficulty:
- **Easy**: Minimum 50 puzzles
- **Medium**: Minimum 50 puzzles
- **Hard**: Minimum 30 puzzles
- **Expert**: Minimum 20 puzzles

---

## 📝 Development Guidelines

- **TDD First**: Write tests before implementation
- **Commit Often**: Make small, frequent commits
- **Code Review**: Follow code style in AGENTS.md
- **Test Coverage**: Maintain high test coverage
- **Refactor**: Keep code clean and maintainable
