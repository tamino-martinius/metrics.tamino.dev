import { useEffect, useMemo, useRef, useState } from 'react';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import { Loading } from '@/components/Loading/Loading';
import { Row, RowType } from '@/components/shared/Row';
import Data from '@/models/Data';
import '@/style/index.css';
import { StatisticsCard } from './Card/StatisticsCard/StatisticsCard';
import { UserCard } from './Card/UserCard/UserCard';
import './App.css';
import { DaytimeChartCard } from './Card/DaytimeChartCard/DaytimeChartCard';
import { TimelineCard } from './Card/TimelineCard/TimelineCard';
import { VisibilityComparisionCard } from './Card/VisibilityComparisionCard/VisibilityComparisionCard';
import { WeekdayChartCard } from './Card/WeekdarChartCard/WeekdayChartCard';
import { WeekdayComparisonCard } from './Card/WeekdayComparisonCard/WeekdayComparisonCard';
import { YearChartCard } from './Card/YearChartCard/YearChartCard';
import { YearHeatmapCard } from './Card/YearHeatmapCard/YearHeatmapCard';

const MIN_SCREEN_SIZE = 920;

interface AppProps {
  style?: React.CSSProperties;
}

const syncViewport = () => {
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
};

export default function App({ style }: AppProps) {
  const dataRef = useRef(new Data());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataRef.current.fetchData().then(() => setIsLoading(false));
  }, []);

  useEffect(syncViewport, []);

  const content = useMemo(() => {
    if (isLoading) return null;

    return (
      <div className="app__content">
        <Header />
        <Row
          type={RowType.FIRST_THIRD}
          first={<UserCard data={dataRef.current} />}
          last={<StatisticsCard data={dataRef.current} />}
        />
        <Row>
          <DaytimeChartCard data={dataRef.current} />
        </Row>
        <Row>
          <WeekdayChartCard data={dataRef.current} />
        </Row>
        <Row
          type={RowType.LAST_THIRD}
          first={<WeekdayComparisonCard data={dataRef.current} />}
          last={<VisibilityComparisionCard data={dataRef.current} />}
        />
        <Row>
          <YearChartCard data={dataRef.current} />
        </Row>
        <Row>
          <YearHeatmapCard data={dataRef.current} />
        </Row>
        <Row>
          <TimelineCard data={dataRef.current} />
        </Row>
        <Footer />
      </div>
    );
  }, [isLoading]);

  return (
    <div className={['app', !isLoading ? 'app--loaded' : ''].filter(Boolean).join(' ')} style={style}>
      {content}
      <Loading hidden={!isLoading} />
    </div>
  );
}
