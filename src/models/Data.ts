import type { MonthYearKey, PrivatePublicCommitStats } from '@/types/ComponentStats';
import type {
  AccountStats,
  DateKey,
  HourKey,
  Month,
  PublicRepositoryDetails,
  UserStats,
  Weekday,
  Year,
} from '@/types/GitHubStats';
import { splitDateKey, splitHourKey } from '@/util/recordKey';

const GITHUB_ACCOUNTS = ['tamino-martinius', 'tamino-cookieai'];
const MIN_WAIT_DURATION = 3000;

const accountUrls = GITHUB_ACCOUNTS.map(
  (account) => `https://raw.githubusercontent.com/${account}/github-stats/${account}/data/stats.json`,
);

export const EMPTY_COMMIT_STATS: Readonly<PrivatePublicCommitStats> = Object.freeze({
  commitCount: 0,
  publicCommitCount: 0,
  privateCommitCount: 0,
  additions: 0,
  deletions: 0,
  changedFiles: 0,
  publicChangedFiles: 0,
  privateChangedFiles: 0,
});

export class Data {
  #githubAccountStats: AccountStats | null = null;
  #commitsPerLanguage: Record<string, number> = {};
  #commitStatTotals: PrivatePublicCommitStats = { ...EMPTY_COMMIT_STATS };
  #commitStatsPerHour: Partial<Record<HourKey, PrivatePublicCommitStats>> = {};
  #commitStatsPerWeekday: Partial<Record<Weekday, PrivatePublicCommitStats>> = {};
  #commitsPerRepository: Record<string, PrivatePublicCommitStats> = {};
  #publicRepositories: Record<string, PublicRepositoryDetails> = {};
  #commitsPerYearAndRepository: Partial<Record<Year, Record<string, PrivatePublicCommitStats>>> = {};
  #commitsPerDate: Partial<Record<DateKey, PrivatePublicCommitStats>> = {};
  #commitsPerMonthAndYear: Partial<Record<MonthYearKey, PrivatePublicCommitStats>> = {};
  #commitsPerYear: Partial<Record<Year, PrivatePublicCommitStats>> = {};
  #commitsPerMonth: Partial<Record<Month, PrivatePublicCommitStats>> = {};
  #languagesPerYear: Partial<Record<Year, Record<string, number>>> = {};
  #years: Year[] = [];

  async #fetchGithubStats() {
    const responses = await Promise.all(accountUrls.map((url) => fetch(url)));
    const accounts: AccountStats[] = await Promise.all(responses.map((r) => r.json()));
    return accounts.reduce<AccountStats>(
      (acc, account) => {
        Object.assign(acc.organizations, account.organizations);
        Object.assign(acc.languageColors, account.languageColors);
        acc.repositories.push(...account.repositories);
        return acc;
      },
      {
        user: accounts[0].user,
        organizations: {},
        languageColors: {},
        repositories: [],
      },
    );
  }

  #calculateGithubAccountStats() {
    if (!this.#githubAccountStats) return;
    let privateIndex = 0;
    for (const repo of this.#githubAccountStats.repositories) {
      const { public: repoDetails, commitsPerHour, commitsPerDate } = repo;
      const isPublic = typeof repoDetails !== 'undefined';
      const repoName = isPublic ? repoDetails.name : `Private#${++privateIndex}`;
      const repoCommitStats = { ...EMPTY_COMMIT_STATS };
      if (isPublic) {
        this.#publicRepositories[repoName] = repoDetails;
      }
      for (const [key, commitStats] of Object.entries(commitsPerHour)) {
        if (!commitStats) continue;
        const hourKey = key as HourKey;
        const [weekday, _hour] = splitHourKey(hourKey);
        // Repo Stats
        repoCommitStats.commitCount += commitStats.commitCount;
        repoCommitStats.additions += commitStats.additions;
        repoCommitStats.deletions += commitStats.deletions;
        repoCommitStats.changedFiles += commitStats.changedFiles;
        // Hour Stats
        if (!this.#commitStatsPerHour[hourKey]) {
          this.#commitStatsPerHour[hourKey] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitStatsPerHour[hourKey].commitCount += commitStats.commitCount;
        this.#commitStatsPerHour[hourKey].additions += commitStats.additions;
        this.#commitStatsPerHour[hourKey].deletions += commitStats.deletions;
        this.#commitStatsPerHour[hourKey].changedFiles += commitStats.changedFiles;
        // Weekday Stats
        if (!this.#commitStatsPerWeekday[weekday]) {
          this.#commitStatsPerWeekday[weekday] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitStatsPerWeekday[weekday].commitCount += commitStats.commitCount;
        this.#commitStatsPerWeekday[weekday].additions += commitStats.additions;
        this.#commitStatsPerWeekday[weekday].deletions += commitStats.deletions;
        this.#commitStatsPerWeekday[weekday].changedFiles += commitStats.changedFiles;
        // Private/Public Stats
        if (isPublic) {
          repoCommitStats.publicCommitCount += commitStats.commitCount;
          this.#commitStatsPerHour[hourKey].publicCommitCount += commitStats.commitCount;
          this.#commitStatsPerWeekday[weekday].publicCommitCount += commitStats.commitCount;
          repoCommitStats.publicChangedFiles += commitStats.changedFiles;
          this.#commitStatsPerHour[hourKey].publicChangedFiles += commitStats.changedFiles;
          this.#commitStatsPerWeekday[weekday].publicChangedFiles += commitStats.changedFiles;
        } else {
          repoCommitStats.privateCommitCount += commitStats.commitCount;
          this.#commitStatsPerHour[hourKey].privateCommitCount += commitStats.commitCount;
          this.#commitStatsPerWeekday[weekday].privateCommitCount += commitStats.commitCount;
          repoCommitStats.privateChangedFiles += commitStats.changedFiles;
          this.#commitStatsPerHour[hourKey].privateChangedFiles += commitStats.changedFiles;
          this.#commitStatsPerWeekday[weekday].privateChangedFiles += commitStats.changedFiles;
        }
      }
      // Date Stats
      for (const [key, commitStats] of Object.entries(commitsPerDate)) {
        if (!commitStats) continue;
        const dateKey = key as DateKey;
        const [year, month, _day] = splitDateKey(dateKey);
        const monthYearKey = `${year}-${month}` satisfies MonthYearKey;

        // Date Stats
        if (!this.#commitsPerDate[dateKey]) {
          this.#commitsPerDate[dateKey] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitsPerDate[dateKey].commitCount += commitStats.commitCount;
        this.#commitsPerDate[dateKey].additions += commitStats.additions;
        this.#commitsPerDate[dateKey].deletions += commitStats.deletions;
        this.#commitsPerDate[dateKey].changedFiles += commitStats.changedFiles;
        // Year Stats
        if (!this.#commitsPerYear[year]) {
          this.#commitsPerYear[year] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitsPerYear[year].commitCount += commitStats.commitCount;
        this.#commitsPerYear[year].additions += commitStats.additions;
        this.#commitsPerYear[year].deletions += commitStats.deletions;
        this.#commitsPerYear[year].changedFiles += commitStats.changedFiles;
        // Month Stats
        if (!this.#commitsPerMonth[month]) {
          this.#commitsPerMonth[month] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitsPerMonth[month].commitCount += commitStats.commitCount;
        this.#commitsPerMonth[month].additions += commitStats.additions;
        this.#commitsPerMonth[month].deletions += commitStats.deletions;
        this.#commitsPerMonth[month].changedFiles += commitStats.changedFiles;
        // Month Year Stats
        if (!this.#commitsPerMonthAndYear[monthYearKey]) {
          this.#commitsPerMonthAndYear[monthYearKey] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitsPerMonthAndYear[monthYearKey].commitCount += commitStats.commitCount;
        this.#commitsPerMonthAndYear[monthYearKey].additions += commitStats.additions;
        this.#commitsPerMonthAndYear[monthYearKey].deletions += commitStats.deletions;
        this.#commitsPerMonthAndYear[monthYearKey].changedFiles += commitStats.changedFiles;
        // Year and Repository Stats
        if (!this.#commitsPerYearAndRepository[year]) {
          this.#commitsPerYearAndRepository[year] = {};
        }
        if (!this.#commitsPerYearAndRepository[year][repoName]) {
          this.#commitsPerYearAndRepository[year][repoName] = { ...EMPTY_COMMIT_STATS };
        }
        this.#commitsPerYearAndRepository[year][repoName].commitCount += commitStats.commitCount;
        this.#commitsPerYearAndRepository[year][repoName].additions += commitStats.additions;
        this.#commitsPerYearAndRepository[year][repoName].deletions += commitStats.deletions;
        this.#commitsPerYearAndRepository[year][repoName].changedFiles += commitStats.changedFiles;
        // Public/Private Stats
        if (isPublic) {
          this.#commitsPerDate[dateKey].publicCommitCount += commitStats.commitCount;
          this.#commitsPerYear[year].publicCommitCount += commitStats.commitCount;
          this.#commitsPerMonth[month].publicCommitCount += commitStats.commitCount;
          this.#commitsPerMonthAndYear[monthYearKey].publicCommitCount += commitStats.commitCount;
          this.#commitsPerYearAndRepository[year][repoName].publicCommitCount += commitStats.commitCount;
          this.#commitsPerDate[dateKey].publicChangedFiles += commitStats.changedFiles;
          this.#commitsPerYear[year].publicChangedFiles += commitStats.changedFiles;
          this.#commitsPerMonth[month].publicChangedFiles += commitStats.changedFiles;
          this.#commitsPerMonthAndYear[monthYearKey].publicChangedFiles += commitStats.changedFiles;
          this.#commitsPerYearAndRepository[year][repoName].publicChangedFiles += commitStats.changedFiles;
          // Language Stats
          for (const language of repoDetails.languages) {
            this.#commitsPerLanguage[language] = (this.#commitsPerLanguage[language] ?? 0) + commitStats.commitCount;
            if (!this.#languagesPerYear[year]) {
              this.#languagesPerYear[year] = {};
            }
            this.#languagesPerYear[year][language] =
              (this.#languagesPerYear[year][language] ?? 0) + commitStats.commitCount;
          }
        } else {
          this.#commitsPerDate[dateKey].privateCommitCount += commitStats.commitCount;
          this.#commitsPerYear[year].privateCommitCount += commitStats.commitCount;
          this.#commitsPerMonth[month].privateCommitCount += commitStats.commitCount;
          this.#commitsPerMonthAndYear[monthYearKey].privateCommitCount += commitStats.commitCount;
          this.#commitsPerYearAndRepository[year][repoName].privateCommitCount += commitStats.commitCount;
          this.#commitsPerDate[dateKey].privateChangedFiles += commitStats.changedFiles;
          this.#commitsPerYear[year].privateChangedFiles += commitStats.changedFiles;
          this.#commitsPerMonth[month].privateChangedFiles += commitStats.changedFiles;
          this.#commitsPerMonthAndYear[monthYearKey].privateChangedFiles += commitStats.changedFiles;
          this.#commitsPerYearAndRepository[year][repoName].privateChangedFiles += commitStats.changedFiles;
        }
      }
      // Repository Stats
      this.#commitsPerRepository[repoName] = repoCommitStats;
      // Commit Stat Totals
      this.#commitStatTotals.commitCount += repoCommitStats.commitCount;
      this.#commitStatTotals.additions += repoCommitStats.additions;
      this.#commitStatTotals.deletions += repoCommitStats.deletions;
      this.#commitStatTotals.changedFiles += repoCommitStats.changedFiles;
      this.#commitStatTotals.publicCommitCount += repoCommitStats.publicCommitCount;
      this.#commitStatTotals.privateCommitCount += repoCommitStats.privateCommitCount;
      this.#commitStatTotals.publicChangedFiles += repoCommitStats.publicChangedFiles;
      this.#commitStatTotals.privateChangedFiles += repoCommitStats.privateChangedFiles;
    }
    const minYear = Math.min(...Object.keys(this.#commitsPerYear).map(Number));
    this.#years = Array.from({ length: new Date().getFullYear() - minYear + 1 }).map((_x, i) => minYear + i);
  }

  async fetchData() {
    const startTime = Date.now();
    const [githubAccountStats] = await Promise.all([this.#fetchGithubStats()]);
    this.#githubAccountStats = githubAccountStats;
    this.#calculateGithubAccountStats();
    const duration = Date.now() - startTime;
    if (duration < MIN_WAIT_DURATION) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, MIN_WAIT_DURATION - duration);
      });
    }
  }

  get user(): UserStats | null {
    return this.#githubAccountStats?.user ?? null;
  }

  get commitsPerLanguage() {
    return this.#commitsPerLanguage;
  }

  get commitStatTotals() {
    return this.#commitStatTotals;
  }

  get commitStatsPerHour() {
    return this.#commitStatsPerHour;
  }

  get commitStatsPerWeekday() {
    return this.#commitStatsPerWeekday;
  }

  get commitsPerRepository() {
    return this.#commitsPerRepository;
  }

  get commitsPerDate() {
    return this.#commitsPerDate;
  }

  get commitsPerYear() {
    return this.#commitsPerYear;
  }

  get commitsPerYearAndRepository() {
    return this.#commitsPerYearAndRepository;
  }

  get commitsPerMonth() {
    return this.#commitsPerMonth;
  }

  get languagesPerYear() {
    return this.#languagesPerYear;
  }

  get commitsPerMonthAndYear() {
    return this.#commitsPerMonthAndYear;
  }

  get years() {
    return this.#years;
  }

  get publicRepositories() {
    return this.#publicRepositories;
  }
}

export default Data;
