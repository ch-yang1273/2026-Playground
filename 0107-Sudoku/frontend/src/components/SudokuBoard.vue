<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Cell from './Cell.vue'
import NumberPad from './NumberPad.vue'

// Sample puzzle (0 = empty cell)
const initialPuzzle: number[] = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
]

const board = ref<(number | null)[]>(
  initialPuzzle.map((v) => (v === 0 ? null : v))
)

const selectedCell = ref<{ row: number; col: number } | null>(null)

const initialCells = computed(() => {
  return new Set(
    initialPuzzle
      .map((v, i) => (v !== 0 ? i : -1))
      .filter((i) => i !== -1)
  )
})

const getIndex = (row: number, col: number): number => row * 9 + col

const getCellValue = (row: number, col: number): number | null => {
  return board.value[getIndex(row, col)] ?? null
}

const isSelected = (row: number, col: number): boolean => {
  return selectedCell.value?.row === row && selectedCell.value?.col === col
}

const isInitial = (row: number, col: number): boolean => {
  return initialCells.value.has(getIndex(row, col))
}

// Check for duplicates in row, column, or 3x3 box
const hasError = (row: number, col: number): boolean => {
  const value = getCellValue(row, col)
  if (!value) return false

  const index = getIndex(row, col)

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board.value[getIndex(row, c)] === value) return true
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board.value[getIndex(r, col)] === value) return true
  }

  // Check 3x3 box
  const boxStartRow = Math.floor(row / 3) * 3
  const boxStartCol = Math.floor(col / 3) * 3
  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      const i = getIndex(r, c)
      if (i !== index && board.value[i] === value) return true
    }
  }

  return false
}

const selectCell = (row: number, col: number) => {
  if (isInitial(row, col)) {
    selectedCell.value = null
    return
  }
  selectedCell.value = { row, col }
}

const setNumber = (num: number) => {
  if (!selectedCell.value) return
  const { row, col } = selectedCell.value
  if (isInitial(row, col)) return
  board.value[getIndex(row, col)] = num
}

const clearCell = () => {
  if (!selectedCell.value) return
  const { row, col } = selectedCell.value
  if (isInitial(row, col)) return
  board.value[getIndex(row, col)] = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!selectedCell.value) return

  const num = parseInt(event.key)
  if (num >= 1 && num <= 9) {
    setNumber(num)
    return
  }

  if (event.key === 'Backspace' || event.key === 'Delete') {
    clearCell()
    return
  }

  // Arrow key navigation
  const { row, col } = selectedCell.value
  let newRow = row
  let newCol = col

  switch (event.key) {
    case 'ArrowUp':
      newRow = Math.max(0, row - 1)
      break
    case 'ArrowDown':
      newRow = Math.min(8, row + 1)
      break
    case 'ArrowLeft':
      newCol = Math.max(0, col - 1)
      break
    case 'ArrowRight':
      newCol = Math.min(8, col + 1)
      break
  }

  if (newRow !== row || newCol !== col) {
    selectedCell.value = { row: newRow, col: newCol }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="sudoku-container">
    <h1>Sudoku</h1>
    <div class="board">
      <template v-for="row in 9" :key="row">
        <Cell
          v-for="col in 9"
          :key="`${row}-${col}`"
          :value="getCellValue(row - 1, col - 1)"
          :is-selected="isSelected(row - 1, col - 1)"
          :is-initial="isInitial(row - 1, col - 1)"
          :has-error="hasError(row - 1, col - 1)"
          :row="row - 1"
          :col="col - 1"
          @select="selectCell"
        />
      </template>
    </div>
    <div class="instructions">
      <p>Click a cell to select, then use number pad or keyboard (1-9)</p>
      <p>Arrow keys to navigate, Backspace/Delete to clear</p>
    </div>
    <NumberPad @number-select="setNumber" @clear="clearCell" />
  </div>
</template>

<style scoped>
.sudoku-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.board {
  display: grid;
  grid-template-columns: repeat(9, 48px);
  grid-template-rows: repeat(9, 48px);
  border: 3px solid #333;
  background-color: #333;
  gap: 0;
}

.instructions {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.instructions p {
  margin: 4px 0;
}

@media (prefers-color-scheme: dark) {
  h1 {
    color: #fff;
  }

  .board {
    border-color: #888;
    background-color: #888;
  }

  .instructions {
    color: #aaa;
  }
}
</style>
