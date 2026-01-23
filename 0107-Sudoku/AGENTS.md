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

### Frontend (Vue.js + TypeScript)
Run commands from `frontend/` directory:
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run test             # Run all Vitest tests
npm run test <file>      # Run single test file
npm run test:ui          # Run tests in UI mode
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript check
```

### Backend (Spring Boot + Java)
Run commands from project root (uses Gradle wrapper):
```bash
./gradlew clean build    # Build project
./gradlew test           # Run all JUnit tests
./gradlew test --tests <TestClass>  # Run single test class
./gradlew bootRun        # Start dev server
```

### E2E (Playwright)
Run commands from project root:
```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Run tests in UI mode
npm run test:e2e:report  # View test report
npx playwright test <file>  # Run single test file
npx playwright test --project=chromium  # Run in specific browser
```
- Test files in `e2e/` directory with `.spec.ts` extension
- Runs frontend dev server on http://localhost:5173

## Code Style Guidelines

### General
- Write tests BEFORE implementation (TDD)
- Keep functions pure where possible
- Use descriptive names (no abbreviations)
- Max function length: 30 lines
- Max file length: 300 lines

### Frontend (Vue.js + TypeScript)
- **Imports**: External libs, then internal modules, then relative imports
- **Components**: PascalCase for component names, kebab-case in templates
- **Composables**: camelCase with 'use' prefix (e.g., `useSudokuBoard`)
- **Types**: Interfaces for object shapes, types for unions
- **State**: Pinia stores for shared state
- **Props**: Define with TypeScript interfaces
- **Emits**: Define with TypeScript types
- **Formatting**: Prettier (no semicolons, single quotes, 2-space indent, 100 char width)
- **Linting**: ESLint with TypeScript + Vue + Prettier, unused vars are warnings
- **TypeScript**: Strict mode enabled, no unused locals/params

### Backend (Spring Boot + Java)
- **Packages**: `com.sudoku.{layer}` (controller, service, repository, domain)
- **Classes**: PascalCase for classes, camelCase for methods
- **Constants**: UPPER_SNAKE_CASE
- **DTOs**: Suffix with `Request`/`Response`
- **Entities**: Map to DB tables, use JPA annotations
- **Services**: Business logic, use `@Transactional` for DB operations
- **Repositories**: Extend JpaRepository, add custom queries with `@Query`
- **Controllers**: REST endpoints, return ResponseEntity
- **Utility Classes**: Static methods, private constructors, final constants

### Error Handling
- **Frontend**: Use composables for API errors, show user-friendly messages
- **Backend**: Custom exceptions extend RuntimeException, handle with @ControllerAdvice
- **Logging**: SLF4J with meaningful messages at appropriate levels

### Testing
- **Unit tests**: Test single functions in isolation
- **Integration tests**: Test API endpoints with @SpringBootTest
- **E2E tests**: Test user journeys from UI
- **Test naming**: JUnit: `should_<expectedBehavior>_when_<condition>`
- **Test naming**: Playwright: `should_<expectedBehavior>_when_<condition>` (recommended)

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

## Workflow

### Task Execution Pattern
1. Complete one checkbox item from PLAN.md
2. Update the checkbox `[ ]` → `[x]` in PLAN.md
3. **Commit changes** (one commit per completed task)
4. Return and select next task
5. Repeat until all checkboxes complete

### Commit Guidelines

**Commit After Each Task**:
- Always commit after completing one checkbox item from PLAN.md
- Small, focused commits are preferred over large ones
- If a task creates multiple files, commit them together
- If a task involves multiple logical steps, split into multiple commits

**Commit Message Format**:
- Use conventional commit prefixes: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Describe what was done and why
- Example: `feat: implement isValidBoard function for Sudoku validation`

**When to Commit**:
- After completing a single checkbox from PLAN.md
- After passing tests for a new feature
- After finishing a logical unit of work
- Before switching to a different task

### Session Continuity
- Track progress in PLAN.md (persists between sessions)
- Use git commits for version history (required)
- Each Phase completion can be marked with `[IN PROGRESS]` → `[COMPLETED]`

## AI Agent Parallel Execution

### Available Agents

| Agent | Cost | Purpose |
|-------|------|---------|
| `explore` | FREE | Codebase pattern search (read-only) |
| `librarian` | CHEAP | External docs, OSS examples, GitHub search |
| `general` | CHEAP | Multi-step tasks, implementation, debugging |
| `oracle` | EXPENSIVE | Architecture decisions, complex analysis |

### When to Use Which Agent

| Situation | Agent(s) to Use |
|-----------|-----------------|
| Find existing code patterns | `explore` |
| Research external library usage | `librarian` |
| Implement new feature | `general` |
| Debug complex test failures | `general` |
| Multiple independent tasks | `general` x N (parallel) |
| Architecture/design decisions | `oracle` |
| Code review after implementation | `oracle` |

### Parallel Execution Pattern

**Background agents (explore, librarian):**
```
// Fire and forget - system notifies on completion
background_task(agent="explore", prompt="Find X in codebase")
background_task(agent="librarian", prompt="Research Y technique")

// Continue working while they run
// Collect results with background_output(task_id) when notified
```

**General agent for parallel implementation:**
```
// Multiple independent tasks simultaneously
Task(agent="general", prompt="Implement function A with tests")
Task(agent="general", prompt="Implement function B with tests")

// Results returned directly, apply to codebase
```

### Best Practices

1. **Delegate to `general` by default**
   - Main agent (Sisyphus) is EXPENSIVE - minimize direct work
   - `general` is CHEAP with more tokens - delegate most implementation
   - Sisyphus role: orchestrate, review, commit

2. **Sisyphus should only:**
   - Plan and create todo lists
   - Delegate tasks to agents
   - Review agent outputs
   - Apply small fixes
   - Commit changes

3. **Always parallelize when possible**
   - Independent search queries → multiple explore/librarian
   - Independent functions → multiple general agents

4. **Fire background agents early**
   - Start explore/librarian at task beginning
   - Work on other things while they search

5. **Reserve oracle for critical decisions**
   - Expensive but high quality
   - Use after 2+ failed attempts
   - Architecture/security concerns

### Delegation Examples

**Good - Delegate to general:**
```
Task(agent="general", prompt="Implement SudokuBoard component with tests")
Task(agent="general", prompt="Create User entity and repository")
```

**Bad - Sisyphus doing all the work:**
```
// Sisyphus directly writing 100+ lines of code
// Sisyphus debugging test data manually
```
