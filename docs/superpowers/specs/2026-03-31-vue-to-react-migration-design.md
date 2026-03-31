# Vue to React + Vite Migration

## Goal

Migrate the GitHub Contributions dashboard from Vue 2 (class components, Webpack) to plain React (functional components, Vite). No visual or content changes — the rendered HTML for end users must remain identical.

## Approach

In-place replacement (Approach A). Remove the Vue/Webpack setup entirely, create a Vite + React project structure in the same repo. Convert each Vue class component to a React functional component with hooks.

## 1. Build System

### Remove

- `webpack.config.js`
- `.babelrc`
- `tslint.json`
- `yarn.lock` (project uses `package-lock.json` with npm)
- `old/` directory (contains stale old node_modules)

### New dependencies

**Runtime:**
- `react`, `react-dom`, `d3` (keep existing version range)

**Dev:**
- `vite`, `@vitejs/plugin-react`, `sass`, `typescript`
- `@types/react`, `@types/react-dom`, `@types/d3`

### Vite config (`vite.config.ts`)

- `@vitejs/plugin-react` plugin
- `@` path alias resolving to `src/`
- `public/` directory served as static assets (Vite default)

### TypeScript config (`tsconfig.json`)

- `"jsx": "react-jsx"`
- Remove `experimentalDecorators`
- Keep `@/*` path alias
- Target `esnext`, module `esnext`

## 2. Entry Point

### `index.html` (project root, Vite convention)

Move from `src/index.html` to project root. Add `<script type="module" src="/src/main.tsx">` before closing `</body>`. Keep all existing `<head>` meta tags unchanged.

### `src/main.tsx` (replaces `src/index.ts`)

- `ReactDOM.createRoot(document.getElementById('app')!).render(<Main />)`
- `Main` component manages `alpha`, `beta`, `gamma` state via `useState`
- `useEffect` for `deviceorientation` event listener (with cleanup)
- Passes CSS custom properties (`--alpha`, `--beta`, `--gamma`) as inline style to `<App />`

## 3. Component Conversion Pattern

All 20 Vue class components become React functional components:

| Vue pattern | React equivalent |
|---|---|
| `@Prop() foo!: T` | Component props interface, destructured in function signature |
| Class field state (`this.x = y`) | `useState` hook |
| Computed getters (`get foo()`) | `useMemo` hook |
| `mounted()` / `destroyed()` | `useEffect` with cleanup return |
| `$slots.default` | `children` prop |
| `$slots.title` / `$slots.footer` | Named props: `titleSlot`, `footerSlot` |
| `$emit('valueChanged', val)` | Callback prop: `onValueChanged?: (val: T) => void` |
| `class={['a', cond && 'b']}` | `className={['a', cond && 'b'].filter(Boolean).join(' ')}` |
| `style={{ '--color': val }}` | Same — React supports CSS custom properties via `style` with type cast `as React.CSSProperties` |
| `class="foo"` | `className="foo"` |

## 4. Files Kept As-Is (or Nearly)

- **`src/types.ts`** — no changes
- **`src/models/Util.ts`** — no changes
- **`src/models/Data.ts`** — replace `declare const DEBUG_MODE: boolean` and usage with `import.meta.env.DEV`
- **`src/style/index.scss`** — no changes
- **`public/*`** — all static assets unchanged

## 5. Files to Delete

- `webpack.config.js`, `.babelrc`, `tslint.json`
- `src/vue.d.ts`, `src/jsx.d.ts`, `src/index.ts`
- `src/types/` directory (empty)
- `old/` directory
- `yarn.lock`
- `styled-system/` directory (unused)

## 6. Component-Specific Notes

### Card

Vue named slots → React props:
- `$slots.default` → `children`
- `$slots.title` → `titleSlot?: React.ReactNode`
- `$slots.footer` → `footerSlot?: React.ReactNode`

### CountTo

Animation with `requestAnimationFrame`:
- State: `displayValue` via `useState`
- Refs: `startTime`, `rAF`, `printVal`, `remaining`, `localStartVal`, `localDuration`, `paused` via `useRef`
- `useEffect` on mount to call `start()` if `autoplay`
- `useEffect` cleanup to cancel `rAF`
- `count` function as `useCallback` ref

### Chart

- D3 path generation stays identical
- `currentType` state via `useState`
- `ButtonGroup` uses `onValueChanged` callback prop

### ButtonGroup

- `active` index via `useState`, initialized to `labels.length - 1`
- Emits replaced by `onValueChanged` callback prop

### Heatmap

- `colors` dict computed via `useMemo` (replaces constructor logic)

### Row

- Named slots (`$slots.first`, `$slots.last`, `$slots.default`) → props: `first?: React.ReactNode`, `last?: React.ReactNode`, `children?: React.ReactNode`

### App

- `stats` state via `useState<StatsData | false>(false)`
- `useEffect` for data fetch and viewport resize listener
- Viewport meta tag manipulation stays the same (direct DOM access)

## 7. Build & Dev Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 8. Testing Strategy

- Visual comparison: run dev server, verify each section matches the original
- Check: loading animation, animated counters, chart rendering, button group toggling, heatmap colors, responsive viewport meta tag
