import { type FC, memo } from 'react';
import { Chart } from '@/components/shared/Chart';
import type { Graph } from '@/types/ComponentStats';
import './DaytimeChartCard.css';
import { HOUR_TITLES, HOURS, WEEKDAY_TITLES_LONG, WEEKDAYS } from '@/constants';
import type Data from '@/models/Data';
import { joinHourKey } from '@/util/recordKey';
import './DaytimeChartCard.css';

interface DaytimeChartCardProps {
  data: Data;
}

export const DaytimeChartCard: FC<DaytimeChartCardProps> = memo(({ data }) => {
  const { commitStatsPerHour, commitStatsPerWeekday } = data;
  const graphs: Graph[] = WEEKDAYS.map((weekday, i) => ({
    title: WEEKDAY_TITLES_LONG[i],
    color: `color-${i + 1}`,
    value: commitStatsPerWeekday[weekday]?.commitCount ?? 0,
    values: HOURS.map((hour) => commitStatsPerHour[joinHourKey(weekday, hour)]?.commitCount ?? 0),
  }));

  return (
    <Chart
      className="daytime-chart-card"
      title="Daytime Chart"
      graphs={graphs}
      xLabels={HOUR_TITLES.filter((_, i) => i % 2 === 1)}
    />
  );
});
