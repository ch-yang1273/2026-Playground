<script setup lang="ts">
interface CellProps {
  value: number | null
  isSelected: boolean
  isInitial: boolean
  hasError: boolean
  row: number
  col: number
}

interface CellEmits {
  (e: 'select', row: number, col: number): void
}

defineProps<CellProps>()
const emit = defineEmits<CellEmits>()

const handleClick = (row: number, col: number) => {
  emit('select', row, col)
}
</script>

<template>
  <div
    class="cell"
    :class="{
      selected: isSelected,
      initial: isInitial,
      error: hasError,
      'border-right': (col + 1) % 3 === 0 && col < 8,
      'border-bottom': (row + 1) % 3 === 0 && row < 8,
    }"
    @click="handleClick(row, col)"
    tabindex="0"
  >
    {{ value || '' }}
  </div>
</template>

<style scoped>
.cell {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  transition: background-color 0.15s ease;
  user-select: none;
}

.cell:hover {
  background-color: #e8f4ff;
}

.cell.selected {
  background-color: #bbdefb;
  outline: 2px solid #1976d2;
  outline-offset: -2px;
}

.cell.initial {
  font-weight: 700;
  color: #333;
}

.cell:not(.initial) {
  color: #1976d2;
}

.cell.error {
  background-color: #ffcdd2;
}

.cell.error.selected {
  background-color: #ef9a9a;
}

.cell.border-right {
  border-right: 2px solid #333;
}

.cell.border-bottom {
  border-bottom: 2px solid #333;
}

@media (prefers-color-scheme: dark) {
  .cell {
    background-color: #2d2d2d;
    border-color: #555;
    color: #fff;
  }

  .cell:hover {
    background-color: #3a3a3a;
  }

  .cell.selected {
    background-color: #1565c0;
  }

  .cell.initial {
    color: #fff;
  }

  .cell:not(.initial) {
    color: #64b5f6;
  }

  .cell.error {
    background-color: #b71c1c;
  }

  .cell.error.selected {
    background-color: #c62828;
  }

  .cell.border-right {
    border-right-color: #888;
  }

  .cell.border-bottom {
    border-bottom-color: #888;
  }
}
</style>
