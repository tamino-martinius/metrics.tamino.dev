# Vue to React + Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the GitHub Contributions dashboard from Vue 2 + Webpack to React + Vite with zero visual changes.

**Architecture:** In-place replacement. Remove all Vue/Webpack tooling, set up Vite + React, convert each Vue class component to a React functional component with hooks. Keep models, types, SCSS, and public assets unchanged.

**Tech Stack:** React 18, Vite, TypeScript, D3 v5, SCSS

---

## File Structure

### Files to Create
- `vite.config.ts` — Vite config with React plugin and `@` alias
- `index.html` — root HTML (moved from `src/index.html`, adapted for Vite)
- `src/main.tsx` — React entry point (replaces `src/index.ts`)
- `src/vite-env.d.ts` — Vite client type declarations
- `src/components/App.tsx` — rewritten as React functional component
- `src/components/AboutMe.tsx` — rewritten
- `src/components/Bar.tsx` — rewritten
- `src/components/ButtonGroup.tsx` — rewritten
- `src/components/Card.tsx` — rewritten
- `src/components/Chart.tsx` — rewritten
- `src/components/ContributionComparison.tsx` — rewritten
- `src/components/CountTo.tsx` — rewritten
- `src/components/Daytime.tsx` — rewritten
- `src/components/DaytimeComparison.tsx` — rewritten
- `src/components/Footer.tsx` — rewritten
- `src/components/Header.tsx` — rewritten
- `src/components/Heatmap.tsx` — rewritten
- `src/components/Legend.tsx` — rewritten
- `src/components/Loading.tsx` — rewritten
- `src/components/Row.tsx` — rewritten
- `src/components/Statistics.tsx` — rewritten
- `src/components/Timeline.tsx` — rewritten
- `src/components/WeekdayComparison.tsx` — rewritten
- `src/components/YearlyStatistics.tsx` — rewritten
- `src/components/Years.tsx` — rewritten

### Files to Modify
- `src/models/Data.ts` — replace `DEBUG_MODE` with `import.meta.env.DEV`
- `tsconfig.json` — update for React JSX
- `package.json` — replace all dependencies and scripts
- `.gitignore` — add Vite-specific entries

### Files to Delete
- `webpack.config.js`
- `.babelrc`
- `tslint.json`
- `yarn.lock`
- `src/index.ts`
- `src/index.html`
- `src/vue.d.ts`
- `src/jsx.d.ts`
- `src/types/` (empty directory)
- `styled-system/` (empty directory tree)
- `old/` (stale old node_modules)

### Files Unchanged
- `src/types.ts`
- `src/models/Util.ts`
- `src/style/index.scss`
- `public/*` (all static assets)
- `config`
- `scripts/deploy.sh`
- `LICENSE`, `README.md`

---

## Task 1: Clean up old tooling and set up Vite + React project skeleton

**Files:**
- Delete: `webpack.config.js`, `.babelrc`, `tslint.json`, `yarn.lock`, `src/index.ts`, `src/vue.d.ts`, `src/jsx.d.ts`
- Delete: `src/types/` directory, `styled-system/` directory, `old/` directory
- Create: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`
- Modify: `src/models/Data.ts`

- [ ] **Step 1: Delete old Vue/Webpack files**

```bash
rm webpack.config.js .babelrc tslint.json yarn.lock src/index.ts src/vue.d.ts src/jsx.d.ts
rm -rf src/types styled-system old
```

- [ ] **Step 2: Move src/index.html to root and adapt for Vite**

Delete `src/index.html` and create `index.html` at project root with this content:

```html
<!doctype html>
<html lang="en">

<head>
  <title>Tamino Martinius - GitHub Contributions</title>
  <meta id="vp" name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="GitHub Contribution Stats of Tamino Martinius">
  <meta name="keywords" content="github, git, contribution, statistics, tamino, martinius, tamino martinius">
  <meta property="og:title" content="Tamino Martinius - GitHub Contributions" />
  <meta property="og:locale" content="en" />
  <meta property="og:type" content="profile" />
  <meta property="profile:first_name" content="Tamino" />
  <meta property="profile:last_name" content="Martinius" />
  <meta property="profile:username" content="tamino.martinius" />
  <meta property="profile:gender" content="male" />
  <meta property="og:url" content="https://contributions.taminomartinius.de" />
  <meta property="og:image" content="https://contributions.taminomartinius.de/og_image.png" />
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
```

- [ ] **Step 3: Rewrite package.json**

```json
{
  "name": "contributions-taminomartinius-de",
  "private": true,
  "description": "Display all GitHub Contributions of tamino-martinius",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "scripts/deploy.sh"
  },
  "keywords": [
    "github",
    "contributions",
    "react",
    "vite",
    "typescript"
  ],
  "author": {
    "name": "Tamino Martinius",
    "url": "https://github.com/tamino-martinius/"
  },
  "license": "MIT",
  "dependencies": {
    "d3": "^5.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/d3": "^5.0.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "sass": "^1.86.3",
    "typescript": "^5.7.3",
    "vite": "^6.2.5"
  }
}
```

- [ ] **Step 4: Rewrite tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 6: Create src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 7: Create src/main.tsx (minimal placeholder)**

This is a minimal placeholder so we can verify the build works. It will be completed in Task 3 after the App component is ready.

```tsx
import { createRoot } from 'react-dom/client';

function Main() {
  return <div>Migration in progress...</div>;
}

createRoot(document.getElementById('app')!).render(<Main />);
```

- [ ] **Step 8: Update src/models/Data.ts**

Replace `DEBUG_MODE` with `import.meta.env.DEV`:

```typescript
import { StatsData } from '@/types';
import Util from '@/models/Util';

const GITHUB_USER_LOGIN = 'tamino-martinius';
const MIN_WAIT_DURATION = 3000;

export class Data {
  async getStats(): Promise<StatsData> {
    const startTime = Date.now();
    const response = await fetch(`/${import.meta.env.DEV ? 'dev' : GITHUB_USER_LOGIN}.json`);
    const data: StatsData = await response.json();
    const duration = Date.now() - startTime;
    if (duration < MIN_WAIT_DURATION) {
      await Util.waitFor(MIN_WAIT_DURATION - duration);
    }
    return data;
  }
}

export default Data;
```

- [ ] **Step 9: Update .gitignore**

Replace the contents with:

```
node_modules
dist
.DS_Store
*.local
.next
.playwright-mcp
```

- [ ] **Step 10: Delete node_modules and install fresh dependencies**

```bash
rm -rf node_modules package-lock.json
npm install
```

- [ ] **Step 11: Verify Vite dev server starts**

```bash
npx vite --host 2>&1 | head -5
```

Expected: Vite outputs a local URL like `http://localhost:5173/`. Stop the server after verifying.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Replace Vue/Webpack with Vite + React skeleton"
```

---

## Task 2: Convert leaf components (no child components)

These components have no dependencies on other custom components. Convert them first.

**Files:**
- Rewrite: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Loading.tsx`, `src/components/Row.tsx`, `src/components/Bar.tsx`, `src/components/ButtonGroup.tsx`

- [ ] **Step 1: Rewrite Header.tsx**

```tsx
export default function Header() {
  return (
    <header className="header">
      <h1>GitHub Contributions</h1>
    </header>
  );
}
```

- [ ] **Step 2: Rewrite Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <a href="https://taminomartinius.de">
            Made with ❤ by Tamino Martinius
          </a>
        </div>
        <div className="footer__center">
          <a href="https://github.com/tamino-martinius/contributions.taminomartinius.de">
            Open Source - Code available at GitHub
          </a>
        </div>
        <div className="footer__right">
          <a href="https://taminomartinius.de/#legal">
            Legal
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Rewrite Loading.tsx**

```tsx
import { useEffect, useState } from 'react';

interface LoadingProps {
  hidden: boolean;
}

export default function Loading({ hidden }: LoadingProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  const line1 = `
    M100 100c49-26.7 76.7-26.7 86 0 7.6 40-50 75-86 90
    s-85 16-84-90c.7-70.7 23.3-82.3 68-35l35 35
  `;
  const line2 = `
    M100 100C88 20.7 73-.1 55 25c-27 44-18 178 45 143
    s83-134 41-148c-28-9.3-41.7 7-41 49.2V119
  `;

  return (
    <div className="loading" style={{ opacity: hidden ? 0 : opacity }}>
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle className="loading__center" cx="100" cy="100" r="7" />
        <rect className="loading__rect" x="65" y="65" width="70" height="70" rx="6" />
        <path className="loading__line loading__line--1" d={line1} />
        <path className="loading__line loading__line--2" d={line2} />
        <circle className="loading__dot loading__dot--1" cx="119" cy="100" r="7" />
        <circle className="loading__dot loading__dot--2" cx="100" cy="81" r="7" />
        <circle className="loading__dot loading__dot--3" cx="100" cy="119" r="7" />
        <mask id="loading__mask">
          <rect
            className="loading__rect loading__rect--masked"
            x="65" y="65" width="70" height="70" rx="6"
          />
        </mask>
        <path
          className="loading__line loading__line--masked loading__line--1"
          mask="url(#loading__mask)" d={line1}
        />
        <path
          className="loading__line loading__line--masked loading__line--2"
          mask="url(#loading__mask)" d={line2}
        />
      </svg>
      <div className="loading__title">
        Loading Git Stats
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite Row.tsx**

```tsx
import { ReactNode } from 'react';

export enum RowType {
  FULL = 'row--full',
  FIRST_THIRD = 'row--first-third',
  LAST_THIRD = 'row--last-third',
}

interface RowProps {
  type?: RowType;
  children?: ReactNode;
  first?: ReactNode;
  last?: ReactNode;
}

export default function Row({ type, children, first, last }: RowProps) {
  const classes = ['row', type || RowType.FULL];

  return (
    <div className={classes.join(' ')}>
      {children}
      {first}
      {last}
    </div>
  );
}
```

- [ ] **Step 5: Rewrite Bar.tsx**

```tsx
import { DataPoint } from '@/types';
export { DataPoint } from '@/types';

export enum BarType {
  HORIZONTAL = 'bar--horizontal',
  VERTICAL = 'bar--vertical',
}

interface BarProps {
  sections: DataPoint[];
  type?: BarType;
  style?: React.CSSProperties;
}

export default function Bar({ sections, type, style }: BarProps) {
  const barType = type || BarType.HORIZONTAL;

  const sectionElements = sections.map((data, i) => (
    <div
      key={i}
      className={['bar__section', barType].join(' ')}
      style={{ '--color': `var(--${data.color})` } as React.CSSProperties}
    >
      {data.value.toLocaleString()}
    </div>
  ));

  const weights = sections.map(data => `${data.value}fr`).join(' ');
  const template = barType === BarType.HORIZONTAL ? 'gridTemplateColumns' : 'gridTemplateRows';

  return (
    <div className="bar" style={{ [template]: weights, ...style }}>
      {sectionElements}
    </div>
  );
}
```

- [ ] **Step 6: Rewrite ButtonGroup.tsx**

```tsx
import { useState } from 'react';

interface ButtonGroupProps {
  labels: string[];
  values?: any[];
  onValueChanged?: (value: any) => void;
}

export default function ButtonGroup({ labels, values, onValueChanged }: ButtonGroupProps) {
  const [active, setActive] = useState(labels.length - 1);

  function handleClick(index: number) {
    setActive(index);
    if (onValueChanged) {
      onValueChanged((values || labels)[index]);
    }
  }

  const buttons = labels.map((label, i) => (
    <button
      key={i}
      onClick={() => handleClick(i)}
      className={`button-group__button${i === active ? ' button-group__button--active' : ''}`}
    >
      {label}
    </button>
  ));

  return (
    <div className="button-group">
      {buttons}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/Loading.tsx src/components/Row.tsx src/components/Bar.tsx src/components/ButtonGroup.tsx
git commit -m "Convert leaf components to React"
```

---

## Task 3: Convert CountTo component

This is complex due to `requestAnimationFrame` animation logic.

**Files:**
- Rewrite: `src/components/CountTo.tsx`

- [ ] **Step 1: Rewrite CountTo.tsx**

```tsx
import { useEffect, useRef, useState } from 'react';

const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
const caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

interface CountToProps {
  startVal?: number;
  endVal?: number;
  duration?: number;
  autoplay?: boolean;
  decimals?: number;
  decimal?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  useEasing?: boolean;
}

function easing(t: number, b: number, c: number, d: number) {
  return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
}

function formatNumber(
  value: number,
  decimals: number,
  decimal: string,
  separator: string,
  prefix: string,
  suffix: string,
) {
  let num = value.toFixed(decimals);
  num += '';
  const x = num.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator && isNaN(Number(separator))) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + separator + '$2');
    }
  }
  return prefix + x1 + x2 + suffix;
}

export default function CountTo({
  startVal = 0,
  endVal = 0,
  duration = 3000,
  autoplay = true,
  decimals = 0,
  decimal = '.',
  separator = ',',
  prefix = '',
  suffix = '',
  useEasing: useEasingProp = true,
}: CountToProps) {
  const [displayValue, setDisplayValue] = useState(
    formatNumber(startVal, decimals, decimal, separator, prefix, suffix),
  );

  const rAFRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const localStartValRef = useRef(startVal);
  const localDurationRef = useRef(duration);

  const countDown = startVal > endVal;

  useEffect(() => {
    function count(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;

      let printVal: number;
      if (useEasingProp) {
        if (countDown) {
          printVal = localStartValRef.current - easing(
            progress, 0, localStartValRef.current - endVal, localDurationRef.current,
          );
        } else {
          printVal = easing(
            progress, localStartValRef.current, endVal - localStartValRef.current, localDurationRef.current,
          );
        }
      } else {
        if (countDown) {
          printVal = localStartValRef.current - (
            (localStartValRef.current - endVal) * (progress / localDurationRef.current)
          );
        } else {
          printVal = localStartValRef.current +
            (endVal - localStartValRef.current) * (progress / localDurationRef.current);
        }
      }

      if (countDown) {
        printVal = printVal < endVal ? endVal : printVal;
      } else {
        printVal = printVal > endVal ? endVal : printVal;
      }

      setDisplayValue(formatNumber(printVal, decimals, decimal, separator, prefix, suffix));

      if (progress < localDurationRef.current) {
        rAFRef.current = raf(count);
      }
    }

    if (autoplay) {
      localStartValRef.current = startVal;
      startTimeRef.current = undefined;
      localDurationRef.current = duration;
      rAFRef.current = raf(count);
    }

    return () => {
      if (rAFRef.current) caf(rAFRef.current);
    };
  }, [startVal, endVal, duration, autoplay, decimals, decimal, separator, prefix, suffix, useEasingProp, countDown]);

  return (
    <div className="count-to">
      {displayValue}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CountTo.tsx
git commit -m "Convert CountTo animation component to React"
```

---

## Task 4: Convert Card and Legend components

Card uses named slots (→ React props). Legend depends on CountTo (done in Task 3).

**Files:**
- Rewrite: `src/components/Card.tsx`, `src/components/Legend.tsx`

- [ ] **Step 1: Rewrite Card.tsx**

```tsx
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  className?: string;
  children?: ReactNode;
  titleSlot?: ReactNode;
  footerSlot?: ReactNode;
}

export default function Card({ title, className, children, titleSlot, footerSlot }: CardProps) {
  const footer = footerSlot ? (
    <div className="card__footer">
      {footerSlot}
    </div>
  ) : undefined;

  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      <div className="card__title">
        <h2>{title}</h2>
        {titleSlot}
      </div>
      <div className="card__content">
        {children}
      </div>
      {footer}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Legend.tsx**

```tsx
import { DataPoint } from '@/types';
export { DataPoint } from '@/types';
import CountTo from '@/components/CountTo';

interface LegendProps {
  sections: DataPoint[];
  columns?: string;
  decimals?: number;
  className?: string;
}

export default function Legend({ sections, columns, decimals, className }: LegendProps) {
  const gridTemplateColumns = columns || sections.map(() => '1fr').join(' ');

  const legends = sections.map((data, i) => (
    <div key={i}>
      <div className="legend__color" style={{ '--color': `var(--${data.color})` } as React.CSSProperties} />
      <div className="legend__title">
        {data.title}
      </div>
      <div className="legend__value">
        <CountTo
          decimals={decimals}
          duration={Math.random() * 1000 + 500}
          endVal={data.value < 1 ? data.value * 100 : data.value}
          suffix={data.value < 1 ? ' %' : ''}
        />
      </div>
    </div>
  ));

  return (
    <div className={['legend', className].filter(Boolean).join(' ')} style={{ gridTemplateColumns }}>
      {legends}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Card.tsx src/components/Legend.tsx
git commit -m "Convert Card and Legend components to React"
```

---

## Task 5: Convert Heatmap component

**Files:**
- Rewrite: `src/components/Heatmap.tsx`

- [ ] **Step 1: Rewrite Heatmap.tsx**

```tsx
import { useMemo } from 'react';
import { Dict } from '@/types';

interface HeatmapProps {
  year: string;
  counts: (number | undefined)[];
  max: number;
}

export default function Heatmap({ year, counts, max }: HeatmapProps) {
  const colors = useMemo(() => {
    let colorIndex = 2;
    let colorLimit = ~~(max / 2);
    const colors: Dict<string> = {};
    for (let i = max; i > 0; i -= 1) {
      colors[i.toString()] = `color-${colorIndex}`;
      if (i === colorLimit) {
        colorIndex = Math.min(7, colorIndex + 1);
        colorLimit = ~~(colorLimit / 2);
      }
    }
    colors['0'] = 'color-0';
    return colors;
  }, [max]);

  const cells = counts.map((count, i) => (
    <div
      key={i}
      className="heatmap__cell"
      style={{
        '--color': `var(--${
          count === undefined ? 'color-empty' : colors[count.toString()]
        })`,
      } as React.CSSProperties}
    />
  ));

  const offset = new Date(year).getDay();
  const offsetCells = [];
  for (let i = 0; i < offset; i += 1) {
    offsetCells.push(<div key={`offset-${i}`} />);
  }

  const legendColors = ['color-0'];
  for (let i = 7; i > 0; i -= 1) {
    legendColors.push(`color-${i}`);
  }

  const legendCells = legendColors.map((color, i) => (
    <div key={i} className="heatmap__cell" style={{ '--color': `var(--${color})` } as React.CSSProperties} />
  ));

  return (
    <div className="heatmap">
      <div className="heatmap__grid">
        {offsetCells}
        {cells}
      </div>
      <div className="heatmap__legend">
        <div>less</div>
        {legendCells}
        <div>more</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Heatmap.tsx
git commit -m "Convert Heatmap component to React"
```

---

## Task 6: Convert Chart component (D3 visualization)

**Files:**
- Rewrite: `src/components/Chart.tsx`

- [ ] **Step 1: Rewrite Chart.tsx**

```tsx
import { useState } from 'react';
import { Graph } from '@/types';
import Card from '@/components/Card';
import ButtonGroup from '@/components/ButtonGroup';
import Legend from '@/components/Legend';
import { scaleLinear, area, line, curveBasis } from 'd3';

export enum ChartType {
  LINES = 'chart--lines',
  STACKED = 'chart--stacked',
  COMPARE = 'chart--compare',
}

const CHART_WIDTH = 840;
const CHART_HEIGHT = 200;

interface ChartProps {
  graphs: Graph[];
  title: string;
  xLabels: string[];
  type?: ChartType;
  className?: string;
}

export default function Chart({ graphs: graphsProp, title, xLabels, type, className }: ChartProps) {
  const [currentType, setCurrentType] = useState(type || ChartType.STACKED);

  const classes = [className, currentType].filter(Boolean).join(' ');
  const graphs: Graph[] = graphsProp.map(graph => ({
    title: graph.title,
    color: graph.color,
    value: graph.value,
    values: graph.values.slice(0),
  }));

  const xMax = Math.max(...graphs.map(graph => graph.values.length));
  let y0 = Array.from({ length: xMax }).map(() => 0);
  if (currentType === ChartType.STACKED) {
    for (let i = 1; i < graphs.length; i += 1) {
      graphs[i].values = graphs[i].values.map(
        (y, x) => y + graphs[i - 1].values[x] || 0,
      );
    }
  }
  const yMax = Math.max(...graphs.map(graph =>
    Math.max(...graph.values),
  ));

  const xScale = scaleLinear().domain([0, xMax - 1]).range([0, CHART_WIDTH]);
  const yScaleComplete = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT, 0]);
  const yScaleTop = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT / 2, 0]);
  const yScaleBottom = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT / 2, CHART_HEIGHT]);

  const createPath = (values: number[], index: number) => {
    let yScale = yScaleComplete;
    if (currentType === ChartType.COMPARE) {
      yScale = index % 2 === 1 ? yScaleTop : yScaleBottom;
    }
    return line<number>()
      .x((_d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(curveBasis)(values);
  };

  const createArea = (values: number[], index: number) => {
    let yScale = yScaleComplete;
    if (currentType === ChartType.COMPARE) {
      yScale = index % 2 === 1 ? yScaleTop : yScaleBottom;
    }
    return area<number>()
      .x((_d, i) => xScale(i))
      .y0((_d, i) => yScale(y0[i] || 0))
      .y1((d) => yScale(d))
      .curve(curveBasis)(values);
  };

  const graphElements: JSX.Element[] = [];
  for (let i = 0; i < graphs.length; i += 1) {
    const graph = graphs[i];
    graphElements.push(
      <path
        key={`area-${i}`}
        className="chart__area"
        d={createArea(graph.values, i) || undefined}
        style={{ '--color': `var(--${graph.color})` } as React.CSSProperties}
      />,
      <path
        key={`line-${i}`}
        className="chart__graph"
        d={createPath(graph.values, i) || undefined}
        style={{ '--color': `var(--${graph.color})` } as React.CSSProperties}
      />,
    );
    if (currentType === ChartType.STACKED) {
      y0 = graph.values;
    }
  }

  let divider: JSX.Element | undefined;
  let typeToggle: JSX.Element | undefined;

  if (currentType === ChartType.COMPARE) {
    divider = (
      <path
        className="chart__divider"
        d={`M0,${~~(CHART_HEIGHT / 2)}L${CHART_WIDTH},${~~(CHART_HEIGHT / 2)}`}
      />
    );
  } else {
    typeToggle = (
      <ButtonGroup
        labels={['Lines', 'Stacked']}
        values={[ChartType.LINES, ChartType.STACKED]}
        onValueChanged={setCurrentType}
      />
    );
  }

  const xAxisLabels = xLabels.map((label, i) => (
    <label key={i}>{label}</label>
  ));

  return (
    <Card className={classes} title={title} titleSlot={typeToggle} footerSlot={<Legend sections={graphsProp} />}>
      <div className="chart__grid">
        <div className="chart__canvas chart--faded">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            width={`${CHART_WIDTH}px`}
            height={`${CHART_HEIGHT}px`}
          >
            {graphElements}
            {divider}
          </svg>
        </div>
        <div className="chart__axis chart__axis--x">
          {xAxisLabels}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Chart.tsx
git commit -m "Convert Chart component with D3 visualization to React"
```

---

## Task 7: Convert data display components

These components depend on Card, Legend, Bar, CountTo, and Chart (all done).

**Files:**
- Rewrite: `src/components/AboutMe.tsx`, `src/components/Statistics.tsx`, `src/components/ContributionComparison.tsx`

- [ ] **Step 1: Rewrite AboutMe.tsx**

```tsx
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { Dict, Counts, DataPoint } from '@/types';

interface AboutMeProps {
  languages: Dict<Counts>;
  counts: Counts;
}

export default function AboutMe({ languages, counts }: AboutMeProps) {
  const ruby = languages.Ruby.commitCount / counts.commitCount;
  const js = languages.JavaScript.commitCount / counts.commitCount;
  const ts = languages.TypeScript.commitCount / counts.commitCount;
  const html = languages.HTML.commitCount / counts.commitCount;
  const sections: DataPoint[] = [
    { color: 'color-2', title: 'JavaScript', value: js },
    { color: 'color-4', title: 'HTML', value: html },
    { color: 'color-1', title: 'Ruby', value: ruby },
    { color: 'color-3', title: 'TypeScript', value: ts },
  ];

  return (
    <Card
      title="Tamino Martinius"
      className="about-me"
      titleSlot={
        <img
          src="https://avatars3.githubusercontent.com/u/3111766?s=50&v=4"
          className="about-me__avatar"
        />
      }
    >
      <h3>I speak code</h3>
      <h4>
        Head of Development
        <a href="https://shyftplan.com/en/?utm_source=tamino&utm_campaign=contributions">
          &nbsp;@shyftplan
        </a>
      </h4>
      <hr />
      <Legend decimals={2} className="about-me__legend" sections={sections} columns="1fr 1fr" />
    </Card>
  );
}
```

- [ ] **Step 2: Rewrite Statistics.tsx**

```tsx
import Bar from '@/components/Bar';
import Card from '@/components/Card';
import CountTo from '@/components/CountTo';
import Legend from '@/components/Legend';
import { Counts, DataPoint } from '@/types';

interface StatisticsProps {
  counts: Counts;
}

export default function Statistics({ counts }: StatisticsProps) {
  const sections: DataPoint[] = [
    { color: 'color-1', title: 'Additions', value: counts.additions },
    { color: 'color-2', title: 'Deletions', value: counts.deletions },
    { color: 'color-3', title: 'Changed Files', value: counts.changedFiles },
  ];

  return (
    <Card title="Statistics" className="statistics">
      <h3>
        <CountTo endVal={counts.commitCount} />
        Commits
      </h3>
      <h4>In Total</h4>
      <hr />
      <Legend className="statistics__legend" sections={sections} />
      <Bar sections={sections} />
    </Card>
  );
}
```

- [ ] **Step 3: Rewrite ContributionComparison.tsx**

```tsx
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { CommitSplit, DataPoint, Counts } from '@/types';

const ANGLE_START = 0;
const ANGLE_END = 360;
const ANGLE_GAP = 1;
const SVG_SIZE = 160;
const STROKE_WIDTH = 3;
const HOVER_WIDTH = 10 + STROKE_WIDTH;

interface ContributionComparisonProps {
  counts: CommitSplit<Counts>;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
  ].join(' ');
  return d;
}

export default function ContributionComparison({ counts }: ContributionComparisonProps) {
  const valueOpen = counts.open.commitCount / counts.sum.commitCount;
  const valueClosed = counts.closed.commitCount / counts.sum.commitCount;
  const angle = valueOpen * 360;

  const sections: DataPoint[] = [
    { color: 'color-open', title: 'Open Source', value: valueOpen },
    { color: 'color-closed', title: 'Private', value: valueClosed },
  ];

  const classPath = 'contribution-comparison__path';
  const classOpen = 'contribution-comparison__path--open';
  const classClosed = 'contribution-comparison__path--closed';
  const classHover = 'contribution-comparison__path--hover';

  return (
    <Card title="Contribution Comparison" className="contribution-comparison">
      <Legend sections={sections} />
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width={`${SVG_SIZE}px`}
        height={`${SVG_SIZE}px`}
      >
        <path
          className={[classPath, classOpen].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - STROKE_WIDTH / 2,
            ANGLE_START + ANGLE_GAP, angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classOpen, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - HOVER_WIDTH / 2,
            ANGLE_START + ANGLE_GAP, angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - STROKE_WIDTH / 2,
            angle + ANGLE_GAP, ANGLE_END - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - HOVER_WIDTH / 2,
            angle + ANGLE_GAP, ANGLE_END - ANGLE_GAP,
          )}
        />
      </svg>
    </Card>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/AboutMe.tsx src/components/Statistics.tsx src/components/ContributionComparison.tsx
git commit -m "Convert AboutMe, Statistics, ContributionComparison to React"
```

---

## Task 8: Convert chart-based view components

These components use Chart (done in Task 6).

**Files:**
- Rewrite: `src/components/Daytime.tsx`, `src/components/DaytimeComparison.tsx`, `src/components/WeekdayComparison.tsx`, `src/components/Timeline.tsx`, `src/components/Years.tsx`

- [ ] **Step 1: Rewrite Daytime.tsx**

```tsx
import Chart from '@/components/Chart';
import { Dict, Graph, WeekDayStats } from '@/types';

interface DaytimeProps {
  weekDays: Dict<WeekDayStats>;
}

export default function Daytime({ weekDays }: DaytimeProps) {
  const titles = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const hours = Array.from({ length: 24 }).map((_x, i) => i);
  const graphs: Graph[] = Object.values(weekDays).map((stats, i) => ({
    title: titles[i],
    color: `color-${i + 1}`,
    value: stats.commitCount,
    values: hours.map(
      hour => (stats.hours[hour.toString()] && stats.hours[hour.toString()].commitCount) || 0,
    ),
  }));

  const xLabels = [
    '1:00 AM', '3:00 AM', '5:00 AM', '7:00 AM', '9:00 AM', '11:00 AM',
    '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM', '11:00 PM',
  ];

  return (
    <Chart
      className="daytime"
      title="Daytime"
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
```

- [ ] **Step 2: Rewrite DaytimeComparison.tsx**

```tsx
import Chart, { ChartType } from '@/components/Chart';
import { Dict, Graph, WeekDayStats, CommitSplit } from '@/types';

interface DaytimeComparisonProps {
  weekDays: CommitSplit<Dict<WeekDayStats>>;
}

export default function DaytimeComparison({ weekDays }: DaytimeComparisonProps) {
  const hours = Array.from({ length: 24 }).map((_x, i) => i);
  const weekDayIndices = Array.from({ length: 7 }).map((_x, i) => i);
  const openValues = Array.from({ length: 168 }).map(() => 0);
  const closedValues = Array.from({ length: 168 }).map(() => 0);
  for (const weekDay of weekDayIndices) {
    for (const hour of hours) {
      const openHour = weekDays.open[weekDay.toString()].hours[hour.toString()];
      if (openHour) openValues[weekDay * 24 + hour] += openHour.commitCount;
      const closedHour = weekDays.closed[weekDay.toString()].hours[hour.toString()];
      if (closedHour) closedValues[weekDay * 24 + hour] += closedHour.commitCount;
    }
  }

  const openValue = openValues.reduce((sum, value) => sum + value, 0);
  const closedValue = closedValues.reduce((sum, value) => sum + value, 0);

  const openGraph: Graph = {
    title: 'Open Source',
    color: 'color-open',
    value: openValue,
    values: openValues,
  };
  const closedGraph: Graph = {
    title: 'Private',
    color: 'color-closed',
    value: closedValue,
    values: closedValues,
  };
  const graphs = [openGraph, closedGraph];

  const xLabels = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];

  return (
    <Chart
      className="daytime-comparison"
      title="Daytime Comparison"
      type={ChartType.COMPARE}
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
```

- [ ] **Step 3: Rewrite WeekdayComparison.tsx**

```tsx
import Bar, { BarType } from '@/components/Bar';
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { CommitSplit, DataPoint, Dict, WeekDayStats } from '@/types';

interface WeekdayComparisonProps {
  weekdays: CommitSplit<Dict<WeekDayStats>>;
}

export default function WeekdayComparison({ weekdays }: WeekdayComparisonProps) {
  const maxSum = Math.max(...Object.values(weekdays.sum).map(counts => counts.commitCount));

  const bars = [];
  for (let i = 0; i < 7; i += 1) {
    const key = i.toString();
    const sections: DataPoint[] = [
      { color: 'color-open', title: 'Open Source', value: weekdays.open[key].commitCount },
      { color: 'color-closed', title: 'Private', value: weekdays.closed[key].commitCount },
    ];
    bars.push(
      <Bar
        key={i}
        sections={sections}
        type={BarType.VERTICAL}
        style={{ height: `${(weekdays.sum[key].commitCount / maxSum * 125).toFixed(0)}px` }}
      />,
    );
  }

  const xAxisLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, i) => (
    <label key={i}>{label}</label>
  ));

  const sections: DataPoint[] = [
    { color: 'color-open', title: 'Open Source', value: 0 },
    { color: 'color-closed', title: 'Private', value: 0 },
  ];

  return (
    <Card
      title="Weekday Comparison"
      className="weekday-comparison"
      footerSlot={<Legend className="weekday-comparison__legend" sections={sections} />}
    >
      <div className="chart__grid">
        <div className="chart__canvas">
          {bars}
        </div>
        <div className="chart__axis chart__axis--x">
          {xAxisLabels}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Rewrite Timeline.tsx**

```tsx
import Chart, { ChartType } from '@/components/Chart';
import { Dict, Graph, Counts, CommitSplit } from '@/types';

const GROUP_SIZE = 24;

interface TimelineProps {
  dates: CommitSplit<Dict<Counts>>;
}

export default function Timeline({ dates }: TimelineProps) {
  let openValues: number[] = [];
  let closedValues: number[] = [];

  const firstDate = new Date('2013');
  const lastDate = new Date();
  const date = new Date(firstDate);
  while (date < lastDate) {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const openCount = dates.open[key];
    const closedCount = dates.closed[key];
    openValues.push(openCount ? openCount.commitCount : 0);
    closedValues.push(closedCount ? closedCount.commitCount : 0);
    date.setDate(date.getDate() + 1);
  }

  openValues = openValues.reduce<number[]>(
    (arr, value, i) => {
      arr[~~(i / GROUP_SIZE)] = (arr[~~(i / GROUP_SIZE)] || 0) + value;
      return arr;
    },
    [],
  );
  closedValues = closedValues.reduce<number[]>(
    (arr, value, i) => {
      arr[~~(i / GROUP_SIZE)] = (arr[~~(i / GROUP_SIZE)] || 0) + value;
      return arr;
    },
    [],
  );

  const openValue = openValues.reduce((sum, value) => sum + value, 0);
  const closedValue = closedValues.reduce((sum, value) => sum + value, 0);

  const openGraph: Graph = {
    title: 'Open Source',
    color: 'color-open',
    value: openValue,
    values: openValues,
  };
  const closedGraph: Graph = {
    title: 'Private',
    color: 'color-closed',
    value: closedValue,
    values: closedValues,
  };

  const graphs = [openGraph, closedGraph];
  const xLabels: string[] = [];
  const labelDate = new Date(firstDate);
  while (labelDate < lastDate) {
    xLabels.push(`${labelDate.getFullYear()}-${labelDate.getMonth() + 1}`);
    labelDate.setMonth(labelDate.getMonth() + 6);
  }

  return (
    <Chart
      className="timeline"
      title="Timeline"
      type={ChartType.COMPARE}
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
```

- [ ] **Step 5: Rewrite Years.tsx**

```tsx
import Chart from '@/components/Chart';
import { Dict, Graph, Counts } from '@/types';

const GROUP_SIZE = 8;

interface YearsProps {
  dates: Dict<Counts>;
}

export default function Years({ dates }: YearsProps) {
  const years = Array.from({ length: new Date().getFullYear() - 2013 + 1 }).map(
    (_x, i) => 2013 + i,
  );
  const graphs = years.map((year, i) => {
    let sum = 0;
    const graph: Graph = {
      title: year.toString(),
      color: `color-${i + 1}`,
      value: 0,
      values: [],
    };
    const date = new Date(year.toString());
    const lastDate = new Date(year, 11, 31, 23, 59, 59);
    while (date < lastDate) {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const count = dates[key];
      const value = count ? count.commitCount : 0;
      graph.values.push(value);
      sum += value;
      date.setDate(date.getDate() + 1);
    }
    graph.value = sum;
    graph.values = graph.values.reduce<number[]>(
      (arr, value, i) => {
        arr[~~(i / GROUP_SIZE)] = (arr[~~(i / GROUP_SIZE)] || 0) + value;
        return arr;
      },
      [],
    );
    return graph;
  });

  const xLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <Chart
      className="years"
      title="Years"
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Daytime.tsx src/components/DaytimeComparison.tsx src/components/WeekdayComparison.tsx src/components/Timeline.tsx src/components/Years.tsx
git commit -m "Convert chart-based view components to React"
```

---

## Task 9: Convert YearlyStatistics component

Depends on Bar, ButtonGroup, Card, Legend, Heatmap (all done).

**Files:**
- Rewrite: `src/components/YearlyStatistics.tsx`

- [ ] **Step 1: Rewrite YearlyStatistics.tsx**

```tsx
import { useState } from 'react';
import Bar from '@/components/Bar';
import ButtonGroup from '@/components/ButtonGroup';
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import Heatmap from '@/components/Heatmap';
import { Counts, Dict, DataPoint } from '@/types';

interface YearlyStatisticsProps {
  dates: Dict<Counts>;
  repos: Dict<{ commitCount: number; years: Dict<Counts> }>;
}

export default function YearlyStatistics({ dates, repos }: YearlyStatisticsProps) {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const reposOfYear: Dict<Counts> = {};
  for (const repoKey in repos) {
    const repo = repos[repoKey];
    if (repo.years[year]) reposOfYear[repoKey] = repo.years[year];
  }

  function getSections(totalCommits: number) {
    let othersSum = totalCommits;
    const repoKeys = Object.keys(reposOfYear);
    repoKeys.sort((key1, key2) => reposOfYear[key2].commitCount - reposOfYear[key1].commitCount);
    const sections: DataPoint[] = [];
    for (let i = 0; i < repoKeys.length && i < 6; i += 1) {
      const section = {
        color: `color-${i + 1}`,
        title: repoKeys[i].split('/')[1],
        value: reposOfYear[repoKeys[i]].commitCount,
      };
      othersSum -= section.value;
      sections.push(section);
    }
    if (othersSum > 0) {
      sections.push({
        color: 'color-7',
        title: 'All Others',
        value: othersSum,
      });
    }
    return sections;
  }

  const years: string[] = [];
  for (let y = 2013; y <= new Date().getFullYear(); y += 1) {
    years.push(y.toString());
  }

  const startDate = new Date(year);
  const date = new Date(startDate);
  const endDate = new Date(parseInt(year, 10), 11, 31, 23, 59, 59);
  const keys: (string | undefined)[] = [];
  const today = new Date();
  while (date <= endDate) {
    if (date > today) {
      keys.push(undefined);
    } else {
      keys.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    }
    date.setDate(date.getDate() + 1);
  }
  const counts: (number | undefined)[] = [];
  let totalCommits = 0;
  const max = Object.values(dates).reduce((max, d) => Math.max(max, d.commitCount), 0);
  for (const key of keys) {
    if (key) {
      const count = (dates[key] && dates[key].commitCount) || 0;
      counts.push(count);
      totalCommits += count;
    } else {
      counts.push(undefined);
    }
  }
  const sections = getSections(totalCommits);

  return (
    <Card
      title="Yearly Statistics"
      className="yearly-statistics"
      titleSlot={<ButtonGroup labels={years} onValueChanged={setYear} />}
    >
      <h3>Year {year}</h3>
      <h4>{totalCommits.toLocaleString()} Commits</h4>
      <hr />
      <h3 className="yearly-statistics__highlights">Highlights</h3>
      <Heatmap counts={counts} year={year} max={max} />
      <Legend className="yearly-statistics__legend" sections={sections} />
      <Bar sections={sections} />
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/YearlyStatistics.tsx
git commit -m "Convert YearlyStatistics component to React"
```

---

## Task 10: Convert App component and finalize main entry point

**Files:**
- Rewrite: `src/components/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Rewrite App.tsx**

```tsx
import { useEffect, useState } from 'react';
import Data from '@/models/Data';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import Header from '@/components/Header';
import Daytime from '@/components/Daytime';
import DaytimeComparison from '@/components/DaytimeComparison';
import AboutMe from '@/components/AboutMe';
import Statistics from '@/components/Statistics';
import ContributionComparison from '@/components/ContributionComparison';
import Timeline from '@/components/Timeline';
import WeekdayComparison from '@/components/WeekdayComparison';
import YearlyStatistics from '@/components/YearlyStatistics';
import Years from '@/components/Years';
import Row, { RowType } from '@/components/Row';
import { StatsData } from '@/types';
import '@/style/index.scss';

const data = new Data();
const MIN_SCREEN_SIZE = 920;

interface AppProps {
  style?: React.CSSProperties;
}

export default function App({ style }: AppProps) {
  const [stats, setStats] = useState<StatsData | false>(false);

  useEffect(() => {
    data.getStats().then(stats => setStats(stats));
  }, []);

  useEffect(() => {
    function setViewport() {
      const metaViewport = document.getElementById('vp');
      if (metaViewport) {
        if (screen.width < MIN_SCREEN_SIZE) {
          metaViewport.setAttribute('content', `user-scalable=no, width=${MIN_SCREEN_SIZE}`);
        } else {
          metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
        }
      }
    }

    setViewport();
    window.addEventListener('resize', setViewport);
    return () => window.removeEventListener('resize', setViewport);
  }, []);

  let content: JSX.Element | undefined = undefined;

  if (stats) {
    content = (
      <div className="app__content">
        <Header />
        <Row type={RowType.FIRST_THIRD}>
          <AboutMe languages={stats.languages} counts={stats.total.sum} />
          <Statistics counts={stats.total.sum} />
        </Row>
        <Row>
          <Daytime weekDays={stats.weekDays.sum} />
        </Row>
        <Row>
          <DaytimeComparison weekDays={stats.weekDays} />
        </Row>
        <Row type={RowType.LAST_THIRD}>
          <WeekdayComparison weekdays={stats.weekDays} />
          <ContributionComparison counts={stats.total} />
        </Row>
        <Row>
          <Years dates={stats.dates.sum} />
        </Row>
        <Row>
          <YearlyStatistics dates={stats.dates.sum} repos={stats.repositories} />
        </Row>
        <Row>
          <Timeline dates={stats.dates} />
        </Row>
        <Footer />
      </div>
    );
  }

  return (
    <div className={['app', stats ? 'app--loaded' : ''].filter(Boolean).join(' ')} style={style}>
      {content}
      <Loading hidden={!!stats} />
    </div>
  );
}
```

- [ ] **Step 2: Finalize src/main.tsx**

```tsx
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import App from '@/components/App';

function Main() {
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      setAlpha((e.alpha || 0) / 90);
      setBeta(((e.beta || 90) - 90) / 90);
      setGamma((e.gamma || 0) / 90);
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <App
      style={{
        '--alpha': alpha,
        '--beta': beta,
        '--gamma': gamma,
      } as React.CSSProperties}
    />
  );
}

createRoot(document.getElementById('app')!).render(<Main />);
```

- [ ] **Step 3: Commit**

```bash
git add src/components/App.tsx src/main.tsx
git commit -m "Convert App component and finalize React entry point"
```

---

## Task 11: Verify build and fix issues

- [ ] **Step 1: Run TypeScript compilation check**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are errors, fix them.

- [ ] **Step 2: Run Vite build**

```bash
npx vite build
```

Expected: successful build output in `dist/`.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npx vite --host
```

Open in browser and verify:
- Loading animation plays
- Data loads and content appears with scale animation
- Header shows "GitHub Contributions"
- AboutMe card shows language breakdown with animated counters
- Statistics card shows commit counts with animated counters
- All charts render (Daytime, Daytime Comparison, Years, Yearly Statistics, Timeline)
- Weekday Comparison shows vertical bars
- Contribution Comparison shows arc chart
- Yearly Statistics year selector works
- Chart Lines/Stacked toggle works
- Heatmap renders with color scaling
- Footer links present

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "Verify React migration - all components working"
```

---

## Task 12: Clean up Vue slot pattern remnant in Row

The Vue version used named slots (`slot="first"`, `slot="last"`) in the App component. In the React version, Row's `first` and `last` are regular props, but in App.tsx the children of `Row type={RowType.FIRST_THIRD}` and `Row type={RowType.LAST_THIRD}` are passed as `children` not as `first`/`last` props. Verify this renders correctly — the original Vue version rendered `$slots.default`, `$slots.first`, `$slots.last` in sequence. In App.tsx Task 10, children are passed as regular children which maps to `$slots.default`. Since the Vue original also passes via slots, check that the order (default, first, last) produces the same visual layout. If the grid layout depends on DOM order, the children may need to be passed as `first` and `last` props instead.

- [ ] **Step 1: Verify Row rendering in browser**

Check that the two-column rows (FIRST_THIRD and LAST_THIRD) display their children in the correct columns. If the first child appears in the wrong column, update App.tsx to use explicit `first` and `last` props:

For `RowType.FIRST_THIRD`:
```tsx
<Row type={RowType.FIRST_THIRD}
  first={<AboutMe languages={stats.languages} counts={stats.total.sum} />}
  last={<Statistics counts={stats.total.sum} />}
/>
```

For `RowType.LAST_THIRD`:
```tsx
<Row type={RowType.LAST_THIRD}
  first={<WeekdayComparison weekdays={stats.weekDays} />}
  last={<ContributionComparison counts={stats.total} />}
/>
```

- [ ] **Step 2: Commit if changes were needed**

```bash
git add src/components/App.tsx
git commit -m "Fix Row slot rendering for two-column layouts"
```
