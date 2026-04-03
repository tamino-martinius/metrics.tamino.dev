import type { AccountStats } from '@/types/GitHubStats';

type CommitsByLanguage = Record<string, number>;

export const getLanguageUsage = (accountStats: AccountStats) => {
  let totalCommits = 0;
  const commitsByLanguage = accountStats.repositories.reduce<CommitsByLanguage>(
    (acc, repo) => {
      const languages = repo.public?.languages ?? [];
      if (languages.length === 0) return acc;
      const commits = Object.values(repo.commitsPerHour).reduce(
        (acc, stats) => {
          acc += stats.commitCount;
          return acc;
        },
        0,
      );
      totalCommits += commits;
      for (const language of languages) {
        acc[language] = (acc[language] ?? 0) + commits;
      }
      return acc;
    },
    {},
  );
  return Object.entries(commitsByLanguage)
    .sort(([, a], [, b]) => b - a)
    .map(([language, commits]) => ({
      language,
      commits,
      percentage: commits / totalCommits,
    }));
};
