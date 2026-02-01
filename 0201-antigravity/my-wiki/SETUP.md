# My Wiki - 프로젝트 세팅 가이드

Vue3, TypeScript, TailwindCSS v4를 사용한 개인 위키 프로젝트입니다.

## 기술 스택

- **Vue 3** (Composition API)
- **TypeScript**
- **TailwindCSS v4** (Vite 플러그인)
- **Vite** (빌드 도구)
- **Vue Router** (라우팅)
- **Marked** (마크다운 파싱)
- **Highlight.js** (코드 하이라이팅)

---

## 프로젝트 생성

### 1. Vue3 + TypeScript 프로젝트 생성

```bash
npm create vite@latest my-wiki -- --template vue-ts
cd my-wiki
```

### 2. 기본 의존성 설치

```bash
npm install
```

### 3. 추가 의존성 설치

```bash
# 런타임 의존성
npm install vue-router@4 marked highlight.js

# TailwindCSS v4 (Vite 플러그인)
npm install -D tailwindcss @tailwindcss/vite
```

---

## TailwindCSS v4 설정

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### src/style.css

```css
@import "tailwindcss";
```

> **Note**: TailwindCSS v4는 `@tailwind base/components/utilities` 대신 
> 단순히 `@import "tailwindcss"`를 사용합니다.

---

## 개발 서버 실행

```bash
npm run dev
```

---

## 빌드

```bash
npm run build
npm run preview
```
