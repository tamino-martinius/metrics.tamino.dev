import Chart, { ChartType } from '@/components/Chart';
import type { CommitSplit, Counts, Dict, Graph } from '@/types/ComponentStats';

const GROUP_SIZE = 24;

interface TimelineProps {
  dates: CommitSplit<Dict<Counts>>;
}

export default function Timeline({ dates }: TimelineProps) {
  let openValues: number[] = [];
  let closedValues: number[] = [];

  const firstDate = new Date('2013');
  const lastDate = new Date();
  const date = new Date(firstDate);
  while (date < lastDate) {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const openCount = dates.open[key];
    const closedCount = dates.closed[key];
    openValues.push(openCount ? openCount.commitCount : 0);
    closedValues.push(closedCount ? closedCount.commitCount : 0);
    date.setDate(date.getDate() + 1);
  }

  openValues = openValues.reduce<number[]>((arr, value, i) => {
    arr[~~(i / GROUP_SIZE)] = (arr[~~(i / GROUP_SIZE)] || 0) + value;
    return arr;
  }, []);
  closedValues = closedValues.reduce<number[]>((arr, value, i) => {
    arr[~~(i / GROUP_SIZE)] = (arr[~~(i / GROUP_SIZE)] || 0) + value;
    return arr;
  }, []);

  const openValue = openValues.reduce((sum, value) => sum + value, 0);
  const closedValue = closedValues.reduce((sum, value) => sum + value, 0);

  const openGraph: Graph = {
    title: 'Open Source',
    color: 'color-open',
    value: openValue,
    values: openValues,
  };
  const closedGraph: Graph = {
    title: 'Private',
    color: 'color-closed',
    value: closedValue,
    values: closedValues,
  };

  const graphs = [openGraph, closedGraph];
  const xLabels: string[] = [];
  const labelDate = new Date(firstDate);
  while (labelDate < lastDate) {
    xLabels.push(labelDate.getFullYear().toString());
    labelDate.setFullYear(labelDate.getFullYear() + 1);
  }

  return (
    <Chart
      className="timeline"
      title="Timeline"
      type={ChartType.COMPARE}
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
