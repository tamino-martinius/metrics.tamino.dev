import { type FC, memo } from 'react';
import { Chart, ChartType } from '@/components/shared/Chart';
import { HOUR_KEYS, VISIBILITIES, VISIBILITY_TITLES, WEEKDAY_TITLES_LONG } from '@/constants';
import type Data from '@/models/Data';
import type { Graph } from '@/types/ComponentStats';
import { visibilityCommitKey } from '@/util/recordKey';
import './WeekdayChartCard.css';

interface WeekdayChartCardProps {
  data: Data;
}

export const WeekdayChartCard: FC<WeekdayChartCardProps> = memo(({ data }) => {
  const { commitStatsPerHour, commitStatTotals } = data;
  const graphs: Graph[] = VISIBILITIES.map((type, i) => ({
    title: VISIBILITY_TITLES[i],
    color: `color-${type}`,
    value: commitStatTotals[visibilityCommitKey(type)] ?? 0,
    values: HOUR_KEYS.map((hourKey) => commitStatsPerHour[hourKey]?.[visibilityCommitKey(type)] ?? 0),
  }));

  return (
    <Chart
      className="weekday-chart-card"
      title="Weekday Chart"
      type={ChartType.COMPARE}
      graphs={graphs}
      xLabels={WEEKDAY_TITLES_LONG}
    />
  );
});
