import {
  Counts,
  Dict,
  RepositoryStats,
  StatsData,
  WeekDayStats,
} from '@/types/ComponentStats';
import { AccountStats, CommitStats } from '@/types/GitHubStats';

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

function emptyCounts(): Counts {
  return { additions: 0, deletions: 0, changedFiles: 0, commitCount: 0 };
}

function emptyWeekDayStats(): WeekDayStats {
  return { ...emptyCounts(), hours: {} };
}

function addCounts(target: Counts, source: CommitStats | undefined): void {
  if (!source) return;
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
      const isOpen = !!repo.public;
      const repoName = repo.public?.name || `${account.user.username}/Private#${++privateIndex}`;

      // Per-repo stats
      const repoStats: RepositoryStats = { ...emptyCounts(), years: {} };

      // Process commitsPerDate
      for (const [isoDate, stats] of Object.entries(repo.commitsPerDate ?? {})) {
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

      // Only include public repos in the repositories breakdown
      // Private repo commits still count in totals/dates/weekdays
      // and flow into "All Others" in yearly statistics
      if (isOpen) {
        repositories[repoName] = repoStats;
      }

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
      if (isOpen && repo.public?.languages && repo.public?.languages.length > 0) {
        const langCount = repo.public?.languages.length;
        for (const lang of repo.public?.languages) {
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
