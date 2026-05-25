# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check then bundle for production
npm run lint      # Run ESLint
npm run preview   # Serve the dist/ build locally
```

No test suite is configured.

## Architecture

This is a personal developer dashboard — a single-page React 19 + TypeScript app built with Vite. Navigation is handled by a local `useState<Page>` in `App.tsx` (no router); each tab conditionally renders one top-level component.

**State management** lives in `src/store/`:
- `useStore.ts` — single Zustand store combining a counter slice and a text-input slice, shared between the `Counter` and `Input` components on the Playground tab.
- `authStore.ts` — Zustand store with JWT-based auth (login / logout / verify against `/api/auth/*`). Auth is currently commented out in `App.tsx` — the Login flow exists but is disabled.

**Tabs and their main components:**
| Tab | Component | Notes |
|-----|-----------|-------|
| Playground | `Counter`, `Input`, `HomeDirectoryFiles`, `Buttons` | Uses shared Zustand store |
| Data Structures | `DSVisualizer` | Pure local state, custom inline syntax highlighter |
| React Architecture | `ReactArchDiagram` | Diagram/visual only |
| Interview Prep | `InterviewPrep` + `AlgorithmWizard` | Renders `leetcode-interview-cheatsheet.md` via `?raw` import + react-markdown |
| DSA Drill 1 | `<iframe>` | Loads `public/dsa_pattern_drill_1.html` directly |

**Key patterns:**
- Markdown files are imported as raw strings using Vite's `?raw` query (e.g., `import content from '../../file.md?raw'`).
- Each component has a co-located `.css` file; global styles are in `src/index.css` and `src/App.css`.
- `Buttons.tsx` opens hardcoded bank/merchant URLs in new tabs — this is intentional personal tooling.
- `leetcode-solutions.md` in the project root is where LeetCode solutions are appended.
