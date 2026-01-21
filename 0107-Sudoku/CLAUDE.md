# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TDD-based Sudoku web application. Users play difficulty-based puzzles; admins manage puzzle pool.

## Tech Stack

- **Frontend**: Vue.js (Vitest)
- **Backend**: Spring Boot (JUnit)
- **Database**: MariaDB
- **E2E**: Playwright
- **Auth**: JWT

## Domain Rules

### Difficulty Classification (by solving technique required)
- **Easy**: Naked Single only
- **Medium**: Hidden Single required
- **Hard**: Naked Pair / Pointing required
- **Expert**: Backtracking required

### Puzzle Generation Flow
1. Generate complete board (backtracking)
2. Remove cells while maintaining unique solution
3. Classify difficulty by analyzing required solving techniques

### Ranking Eligibility
- Members only
- No hints used during game

## TDD Implementation Order

1. **Core Logic**: isValidBoard, isValidCell, findDuplicates, isComplete
2. **Solvers**: Naked Single → Hidden Single → Naked Pair → Pointing → Backtracking
3. **Generator**: Complete board → Cell removal → Difficulty classification
4. **API**: Auth → Game → Ranking → Admin
5. **Frontend**: Board → Input → Memo → Undo/Redo → Timer
6. **E2E**: Game play → Member → Admin scenarios
