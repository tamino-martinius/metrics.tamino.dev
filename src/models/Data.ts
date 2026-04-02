import { StatsData } from '@/types/ComponentStats';
import { toStatsData } from '@/models/Transform';
import Util from '@/models/Util';
import { AccountStats } from '@/types/GitHubStats';

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
