import Bar, { BarType } from '@/components/Bar';
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { CommitSplit, DataPoint, Dict, WeekDayStats } from '@/types/ComponentStats';

interface WeekdayComparisonProps {
  weekdays: CommitSplit<Dict<WeekDayStats>>;
}

export default function WeekdayComparison({ weekdays }: WeekdayComparisonProps) {
  const maxSum = Math.max(...Object.values(weekdays.sum).map(counts => counts.commitCount));

  const bars = [];
  for (let i = 0; i < 7; i += 1) {
    const key = i.toString();
    const sections: DataPoint[] = [
      { color: 'color-open', title: 'Open Source', value: weekdays.open[key].commitCount },
      { color: 'color-closed', title: 'Private', value: weekdays.closed[key].commitCount },
    ];
    bars.push(
      <Bar
        key={i}
        sections={sections}
        type={BarType.VERTICAL}
        style={{ height: `${(weekdays.sum[key].commitCount / maxSum * 125).toFixed(0)}px` }}
      />,
    );
  }

  const xAxisLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, i) => (
    <label key={i}>{label}</label>
  ));

  const sections: DataPoint[] = [
    { color: 'color-open', title: 'Open Source', value: 0 },
    { color: 'color-closed', title: 'Private', value: 0 },
  ];

  return (
    <Card
      title="Weekday Comparison"
      className="weekday-comparison"
      footerSlot={<Legend className="weekday-comparison__legend" sections={sections} />}
    >
      <div className="chart__grid">
        <div className="chart__canvas">
          {bars}
        </div>
        <div className="chart__axis chart__axis--x">
          {xAxisLabels}
        </div>
      </div>
    </Card>
  );
}
