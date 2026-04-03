import { useEffect, useMemo, useState } from 'react';
import ContributionComparison from '@/components/ContributionComparison';
import Daytime from '@/components/Daytime';
import DaytimeComparison from '@/components/DaytimeComparison';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import Row, { RowType } from '@/components/Row';
import Statistics from '@/components/Statistics';
import Timeline from '@/components/Timeline';
import WeekdayComparison from '@/components/WeekdayComparison';
import YearlyStatistics from '@/components/YearlyStatistics';
import Years from '@/components/Years';
import Data from '@/models/Data';
import type { StatsData } from '@/types/ComponentStats';
import type { AccountStats } from '@/types/GitHubStats';
import '@/style/index.css';
import { UserCard } from './UserCard/UserCard';

const data = new Data();
const MIN_SCREEN_SIZE = 920;

interface AppProps {
  style?: React.CSSProperties;
}

const syncViewport = () => {
  function setViewport() {
    const metaViewport = document.getElementById('vp');
    if (metaViewport) {
      if (screen.width < MIN_SCREEN_SIZE) {
        metaViewport.setAttribute(
          'content',
          `user-scalable=no, width=${MIN_SCREEN_SIZE}`,
        );
      } else {
        metaViewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1',
        );
      }
    }
  }

  setViewport();
  window.addEventListener('resize', setViewport);
  return () => window.removeEventListener('resize', setViewport);
};

export default function App({ style }: AppProps) {
  const [stats, setStats] = useState<StatsData | false>(false);
  const [accountStats, setAccountStats] = useState<AccountStats | false>(false);

  useEffect(() => {
    data.getStats().then((stats) => setStats(stats));
    data.getAccountStats().then((stats) => setAccountStats(stats));
  }, []);

  useEffect(syncViewport, []);

  const { isLoading, content } = useMemo(() => {
    if (!stats || !accountStats) {
      return { isLoading: true, content: undefined };
    }

    return {
      isLoading: false,
      content: (
        <div className="app__content">
          <Header />
          <Row
            type={RowType.FIRST_THIRD}
            first={<UserCard accountStats={accountStats} />}
            last={<Statistics counts={stats.total.sum} />}
          />
          <Row>
            <Daytime weekDays={stats.weekDays.sum} />
          </Row>
          <Row>
            <DaytimeComparison weekDays={stats.weekDays} />
          </Row>
          <Row
            type={RowType.LAST_THIRD}
            first={<WeekdayComparison weekdays={stats.weekDays} />}
            last={<ContributionComparison counts={stats.total} />}
          />
          <Row>
            <Years dates={stats.dates.sum} />
          </Row>
          <Row>
            <YearlyStatistics
              dates={stats.dates.sum}
              repos={stats.repositories}
            />
          </Row>
          <Row>
            <Timeline dates={stats.dates} />
          </Row>
          <Footer />
        </div>
      ),
    };
  }, [stats, accountStats]);

  return (
    <div
      className={['app', !isLoading ? 'app--loaded' : '']
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {content}
      <Loading hidden={!isLoading} />
    </div>
  );
}
