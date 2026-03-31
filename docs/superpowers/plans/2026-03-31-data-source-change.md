# Data Source Change Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pre-aggregated local JSON with two raw `AccountStats` JSON files fetched from GitHub, merged and transformed into the existing `StatsData` shape.

**Architecture:** New input types + transformation layer (`Transform.ts`) that converts raw `AccountStats[]` into `StatsData`. Data.ts fetches both accounts in parallel. Only AboutMe component changes (dynamic top-4 languages with GitHub colors). All other components untouched.

**Tech Stack:** React, TypeScript, Vite

---

## File Structure

### Files to Create
- `src/models/Transform.ts` — pure functions: `AccountStats[]` → `StatsData`

### Files to Modify
- `src/types.ts` — add input types (`AccountStats`, `RepoStats`, `CommitStats`), add `languageColors` to `StatsData`
- `src/models/Data.ts` — fetch from GitHub URLs, use Transform
- `src/components/AboutMe.tsx` — dynamic top-4 languages with real GitHub colors
- `src/components/App.tsx` — pass `languageColors` to AboutMe

### Files to Delete
- `public/dev.json`
- `public/tamino-martinius.json`

### Files Unchanged
- All other components, models, styles

---

## Task 1: Update types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Rewrite src/types.ts**

Add the new input types and `languageColors` to `StatsData`:

```typescript
export interface Dict<T> {
  [key: string]: T;
}

// --- Input types (from GitHub stats JSON) ---

export interface CommitStats {
  commitCount: number;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface RepoStats {
  name?: string;
  url?: string;
  languages?: string[];
  commitsPerDate: Record<string, CommitStats>;
  commitsPerHour: Record<string, CommitStats>;
}

export interface AccountStats {
  user: {
    username: string;
    avatarUrl: string;
    url: string;
  };
  organizations: Record<string, { avatarUrl: string; url: string }>;
  languageColors: Record<string, string | null>;
  repositories: RepoStats[];
}

// --- Output types (consumed by components) ---

export interface Counts {
  additions: number;
  deletions: number;
  changedFiles: number;
  commitCount: number;
}

export interface CommitSplit<T> {
  closed: T;
  open: T;
  sum: T;
}

export interface StatsData {
  total: CommitSplit<Counts>;
  languages: Dict<Counts>;
  languageColors: Dict<string>;
  weekDays: CommitSplit<Dict<WeekDayStats>>;
  dates: CommitSplit<Dict<Counts>>;
  repositories: Dict<RepositoryStats>;
}

export interface WeekDayStats extends Counts {
  hours: Dict<Counts>;
}

export interface RepositoryStats extends Counts {
  years: Dict<Counts>;
}

export interface DataPoint {
  title: string;
  color: string;
  value: number;
}

export interface Graph extends DataPoint {
  values: number[];
}
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: errors in Data.ts (still references old code) — that's fine, we'll fix it in Task 3.

---

## Task 2: Create Transform.ts

**Files:**
- Create: `src/models/Transform.ts`

- [ ] **Step 1: Create src/models/Transform.ts**

```typescript
import {
  AccountStats,
  CommitStats,
  Counts,
  CommitSplit,
  Dict,
  StatsData,
  WeekDayStats,
  RepositoryStats,
} from '@/types';

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

function emptyCounts(): Counts {
  return { additions: 0, deletions: 0, changedFiles: 0, commitCount: 0 };
}

function emptyWeekDayStats(): WeekDayStats {
  return { ...emptyCounts(), hours: {} };
}

function addCounts(target: Counts, source: CommitStats): void {
  target.commitCount += source.commitCount;
  target.additions += source.additions;
  target.deletions += source.deletions;
  target.changedFiles += source.changedFiles;
}

/** Convert "yyyy-MM-dd" to "yyyy-M0-d" (0-indexed month, non-padded day) */
function convertDateKey(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${year}-${parseInt(month, 10) - 1}-${parseInt(day, 10)}`;
}

/** Extract year from "yyyy-MM-dd" */
function extractYear(isoDate: string): string {
  return isoDate.split('-')[0];
}

/** Parse "ddd, hh" into { weekdayIndex, hour } */
function parseHourKey(key: string): { weekdayIndex: number; hour: number } {
  const [dayAbbr, hourStr] = key.split(', ');
  return {
    weekdayIndex: WEEKDAY_MAP[dayAbbr],
    hour: parseInt(hourStr, 10),
  };
}

function ensureWeekDay(dict: Dict<WeekDayStats>, key: string): WeekDayStats {
  if (!dict[key]) dict[key] = emptyWeekDayStats();
  return dict[key];
}

export function toStatsData(accounts: AccountStats[]): StatsData {
  const openDates: Dict<Counts> = {};
  const closedDates: Dict<Counts> = {};
  const sumDates: Dict<Counts> = {};

  const openWeekDays: Dict<WeekDayStats> = {};
  const closedWeekDays: Dict<WeekDayStats> = {};
  const sumWeekDays: Dict<WeekDayStats> = {};

  // Initialize all 7 weekdays
  for (let i = 0; i < 7; i++) {
    const k = i.toString();
    openWeekDays[k] = emptyWeekDayStats();
    closedWeekDays[k] = emptyWeekDayStats();
    sumWeekDays[k] = emptyWeekDayStats();
  }

  const openTotal = emptyCounts();
  const closedTotal = emptyCounts();
  const sumTotal = emptyCounts();

  const languages: Dict<Counts> = {};
  const languageColors: Dict<string> = {};
  const repositories: Dict<RepositoryStats> = {};

  for (const account of accounts) {
    // Merge language colors
    for (const [lang, color] of Object.entries(account.languageColors)) {
      if (color && !languageColors[lang]) {
        languageColors[lang] = color;
      }
    }

    let privateIndex = 0;

    for (const repo of account.repositories) {
      const isOpen = !!repo.name;
      const repoName = repo.name || `${account.user.username}/Private#${++privateIndex}`;

      // Per-repo stats
      const repoStats: RepositoryStats = { ...emptyCounts(), years: {} };

      // Process commitsPerDate
      for (const [isoDate, stats] of Object.entries(repo.commitsPerDate)) {
        const dateKey = convertDateKey(isoDate);
        const year = extractYear(isoDate);

        // Date aggregation
        if (!sumDates[dateKey]) sumDates[dateKey] = emptyCounts();
        addCounts(sumDates[dateKey], stats);

        const splitDates = isOpen ? openDates : closedDates;
        if (!splitDates[dateKey]) splitDates[dateKey] = emptyCounts();
        addCounts(splitDates[dateKey], stats);

        // Repo total + yearly
        addCounts(repoStats, stats);
        if (!repoStats.years[year]) repoStats.years[year] = emptyCounts();
        addCounts(repoStats.years[year], stats);

        // Totals
        addCounts(sumTotal, stats);
        addCounts(isOpen ? openTotal : closedTotal, stats);
      }

      repositories[repoName] = repoStats;

      // Process commitsPerHour
      for (const [hourKey, stats] of Object.entries(repo.commitsPerHour)) {
        const { weekdayIndex, hour } = parseHourKey(hourKey);
        const wdKey = weekdayIndex.toString();
        const hKey = hour.toString();

        // Sum weekdays
        const sumWd = ensureWeekDay(sumWeekDays, wdKey);
        addCounts(sumWd, stats);
        if (!sumWd.hours[hKey]) sumWd.hours[hKey] = emptyCounts();
        addCounts(sumWd.hours[hKey], stats);

        // Split weekdays
        const splitWeekDays = isOpen ? openWeekDays : closedWeekDays;
        const splitWd = ensureWeekDay(splitWeekDays, wdKey);
        addCounts(splitWd, stats);
        if (!splitWd.hours[hKey]) splitWd.hours[hKey] = emptyCounts();
        addCounts(splitWd.hours[hKey], stats);
      }

      // Language aggregation (only for public repos with languages)
      if (isOpen && repo.languages && repo.languages.length > 0) {
        const langCount = repo.languages.length;
        for (const lang of repo.languages) {
          if (!languages[lang]) languages[lang] = emptyCounts();
          languages[lang].commitCount += repoStats.commitCount / langCount;
          languages[lang].additions += repoStats.additions / langCount;
          languages[lang].deletions += repoStats.deletions / langCount;
          languages[lang].changedFiles += repoStats.changedFiles / langCount;
        }
      }
    }
  }

  return {
    total: { open: openTotal, closed: closedTotal, sum: sumTotal },
    languages,
    languageColors,
    weekDays: { open: openWeekDays, closed: closedWeekDays, sum: sumWeekDays },
    dates: { open: openDates, closed: closedDates, sum: sumDates },
    repositories,
  };
}
```

---

## Task 3: Update Data.ts

**Files:**
- Modify: `src/models/Data.ts`

- [ ] **Step 1: Rewrite src/models/Data.ts**

```typescript
import { AccountStats, StatsData } from '@/types';
import { toStatsData } from '@/models/Transform';
import Util from '@/models/Util';

const ACCOUNT_URLS = [
  'https://raw.githubusercontent.com/tamino-martinius/github-stats/tamino-martinius/data/stats.json',
  'https://raw.githubusercontent.com/tamino-cookieai/github-stats/tamino-cookieai/data/stats.json',
];

const MIN_WAIT_DURATION = 3000;

export class Data {
  async getStats(): Promise<StatsData> {
    const startTime = Date.now();
    const responses = await Promise.all(
      ACCOUNT_URLS.map(url => fetch(url)),
    );
    const accounts: AccountStats[] = await Promise.all(
      responses.map(r => r.json()),
    );
    const stats = toStatsData(accounts);
    const duration = Date.now() - startTime;
    if (duration < MIN_WAIT_DURATION) {
      await Util.waitFor(MIN_WAIT_DURATION - duration);
    }
    return stats;
  }
}

export default Data;
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: errors only in AboutMe.tsx (still references hardcoded languages) — fixed in Task 4.

---

## Task 4: Update AboutMe component

**Files:**
- Modify: `src/components/AboutMe.tsx`
- Modify: `src/components/App.tsx`

- [ ] **Step 1: Rewrite src/components/AboutMe.tsx**

Dynamic top-4 languages with real GitHub hex colors. Uses CSS custom properties on a wrapper so Legend picks up the colors automatically via `var(--${color})`:

```tsx
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { Dict, Counts, DataPoint } from '@/types';

interface AboutMeProps {
  languages: Dict<Counts>;
  languageColors: Dict<string>;
  counts: Counts;
}

export default function AboutMe({ languages, languageColors, counts }: AboutMeProps) {
  // Sort languages by commit count, take top 4
  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b.commitCount - a.commitCount)
    .slice(0, 4);

  const colorVars: Record<string, string> = {};
  const sections: DataPoint[] = topLanguages.map(([lang, langCounts], i) => {
    const varName = `about-lang-${i}`;
    colorVars[`--${varName}`] = languageColors[lang] || '#888';
    return {
      color: varName,
      title: lang,
      value: langCounts.commitCount / counts.commitCount,
    };
  });

  return (
    <div style={colorVars as React.CSSProperties}>
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
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx to pass languageColors**

In `src/components/App.tsx`, change the AboutMe usage (line 57) from:

```tsx
          first={<AboutMe languages={stats.languages} counts={stats.total.sum} />}
```

to:

```tsx
          first={<AboutMe languages={stats.languages} languageColors={stats.languageColors} counts={stats.total.sum} />}
```

- [ ] **Step 3: Verify compilation**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

## Task 5: Delete old data files and verify build

**Files:**
- Delete: `public/dev.json`
- Delete: `public/tamino-martinius.json`

- [ ] **Step 1: Delete old JSON files**

```bash
rm public/dev.json public/tamino-martinius.json
```

- [ ] **Step 2: Run Vite build**

```bash
npx vite build
```

Expected: successful build.

- [ ] **Step 3: Start dev server and verify**

```bash
npx vite
```

Open in browser and verify:
- Loading animation plays while data fetches from GitHub
- All sections render with real data from both accounts combined
- AboutMe card shows top 4 languages with colored dots (GitHub hex colors)
- Statistics shows combined commit counts from both accounts
- All charts render (Daytime, Daytime Comparison, Years, Yearly Statistics, Timeline)
- Weekday Comparison shows bars
- Contribution Comparison shows open vs private arc
- Year selector in Yearly Statistics works across all years
- Private repos appear as `username/Private#N` in yearly breakdown
