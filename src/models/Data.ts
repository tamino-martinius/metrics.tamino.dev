import { toStatsData } from '@/models/Transform';
import Util from '@/models/Util';
import type { StatsData } from '@/types/ComponentStats';
import type { AccountStats } from '@/types/GitHubStats';

const GITHUB_ACCOUNTS = ['tamino-martinius', 'tamino-cookieai'];
const MIN_WAIT_DURATION = 3000;

const accountUrls = GITHUB_ACCOUNTS.map(
  (account) =>
    `https://raw.githubusercontent.com/${account}/github-stats/${account}/data/stats.json`,
);

export class Data {
  async getStats(): Promise<StatsData> {
    const startTime = Date.now();
    const responses = await Promise.all(accountUrls.map((url) => fetch(url)));
    const accounts: AccountStats[] = await Promise.all(
      responses.map((r) => r.json()),
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
