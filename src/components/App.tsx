import { useEffect, useState, JSX } from 'react';
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
import { StatsData } from '@/types/ComponentStats';
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
        <Row type={RowType.FIRST_THIRD}
          first={<AboutMe languages={stats.languages} />}
          last={<Statistics counts={stats.total.sum} />}
        />
        <Row>
          <Daytime weekDays={stats.weekDays.sum} />
        </Row>
        <Row>
          <DaytimeComparison weekDays={stats.weekDays} />
        </Row>
        <Row type={RowType.LAST_THIRD}
          first={<WeekdayComparison weekdays={stats.weekDays} />}
          last={<ContributionComparison counts={stats.total} />}
        />
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
