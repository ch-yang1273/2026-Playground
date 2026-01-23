<script setup lang="ts">
interface NumberPadEmits {
  (e: 'numberSelect', num: number): void
  (e: 'clear'): void
}

const emit = defineEmits<NumberPadEmits>()

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const handleNumberClick = (num: number) => {
  emit('numberSelect', num)
}

const handleClear = () => {
  emit('clear')
}
</script>

<template>
  <div class="number-pad">
    <button
      v-for="num in numbers"
      :key="num"
      class="number-btn"
      @click="handleNumberClick(num)"
    >
      {{ num }}
    </button>
    <button class="clear-btn" @click="handleClear">Clear</button>
  </div>
</template>

<style scoped>
.number-pad {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.number-btn,
.clear-btn {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.number-btn {
  background-color: #e3f2fd;
  color: #1976d2;
}

.number-btn:hover {
  background-color: #bbdefb;
  transform: scale(1.05);
}

.number-btn:active {
  transform: scale(0.95);
}

.clear-btn {
  background-color: #ffebee;
  color: #c62828;
  font-size: 1rem;
}

.clear-btn:hover {
  background-color: #ffcdd2;
  transform: scale(1.05);
}

.clear-btn:active {
  transform: scale(0.95);
}

@media (prefers-color-scheme: dark) {
  .number-btn {
    background-color: #1565c0;
    color: #fff;
  }

  .number-btn:hover {
    background-color: #1976d2;
  }

  .clear-btn {
    background-color: #b71c1c;
    color: #fff;
  }

  .clear-btn:hover {
    background-color: #c62828;
  }
}
</style>
