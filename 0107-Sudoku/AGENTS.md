# AGENTS.md

This file guides AI agents working in this Sudoku TDD project.

## Project Overview

TDD-based Sudoku web application with Vue.js frontend and Spring Boot backend.

## Tech Stack

- **Frontend**: Vue.js + TypeScript + Vitest
- **Backend**: Spring Boot + Java + JUnit + MariaDB
- **E2E**: Playwright
- **Auth**: JWT

## Commands

### Frontend (Vue.js)
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run test             # Run all Vitest tests
npm run test <file>      # Run single test file
npm run test:ui          # Run tests in UI mode
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript check
```

### Backend (Spring Boot)
```bash
./mvnw clean install     # Build project
./mvnw test              # Run all JUnit tests
./mvnw test -Dtest=<TestClass>  # Run single test class
./mvnw test -Dtest=<TestClass>#<testMethod>  # Run single test method
./mvnw spring-boot:run   # Start dev server
./mvnw checkstyle:check  # Run style checks
```

### E2E (Playwright)
```bash
npx playwright test      # Run all E2E tests
npx playwright test <file>  # Run single test file
npx playwright test --project=chromium  # Run in specific browser
npx playwright show-report  # View test report
```

## Code Style Guidelines

### General
- Write tests BEFORE implementation (TDD)
- Keep functions pure where possible
- Use descriptive names (no abbreviations)
- Max function length: 30 lines
- Max file length: 300 lines

### Frontend (Vue.js + TypeScript)
- **Imports**: Order = external libs, internal modules, relative imports
- **Components**: PascalCase for component names, kebab-case for templates
- **Composables**: camelCase with 'use' prefix (e.g., `useSudokuBoard`)
- **Types**: Use interfaces for object shapes, types for unions
- **State**: Use Pinia stores for shared state
- **Props**: Define with TypeScript interfaces
- **Emits**: Define with TypeScript types
- **Formatting**: Prettier with 2-space indentation

### Backend (Spring Boot + Java)
- **Packages**: `com.sudoku.{layer}` (controller, service, repository, domain)
- **Classes**: PascalCase for classes, camelCase for methods
- **Constants**: UPPER_SNAKE_CASE
- **DTOs**: Suffix with `Request`/`Response`
- **Entities**: Map to DB tables, use JPA annotations
- **Services**: Business logic, use `@Transactional` for DB operations
- **Repositories**: Extend JpaRepository, add custom queries with `@Query`
- **Controllers**: REST endpoints, return ResponseEntity

### Error Handling
- **Frontend**: Use composables for API errors, show user-friendly messages
- **Backend**: Custom exceptions extend RuntimeException, handle with @ControllerAdvice
- **Logging**: SLF4J with meaningful messages at appropriate levels

### Testing
- **Unit tests**: Test single functions in isolation
- **Integration tests**: Test API endpoints with @SpringBootTest
- **E2E tests**: Test user journeys from UI
- **Test naming**: `should_<expectedBehavior>_when_<condition>`

### Sudoku Logic
- **Board representation**: 81-element array (row-major) or 9x9 2D array
- **Empty cells**: Represent as 0 or null
- **Difficulty**: Classify by solving technique required
- **Validation**: Check row, column, and 3x3 box constraints

## Domain Knowledge

- **Easy**: Naked Single only
- **Medium**: Hidden Single required
- **Hard**: Naked Pair/Pointing required
- **Expert**: Backtracking required

## Commit Conventions

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code improvement
- `test:` Add/update tests
- `docs:` Documentation
- `chore:` Build/config changes
