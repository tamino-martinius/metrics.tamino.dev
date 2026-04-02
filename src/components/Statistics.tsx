import Bar from '@/components/Bar';
import Card from '@/components/Card';
import CountTo from '@/components/CountTo';
import Legend from '@/components/Legend';
import type { Counts, DataPoint } from '@/types/ComponentStats';

interface StatisticsProps {
  counts: Counts;
}

export default function Statistics({ counts }: StatisticsProps) {
  const sections: DataPoint[] = [
    { color: 'color-1', title: 'Additions', value: counts.additions },
    { color: 'color-2', title: 'Deletions', value: counts.deletions },
    { color: 'color-3', title: 'Changed Files', value: counts.changedFiles },
  ];

  return (
    <Card title="Statistics" className="statistics">
      <h3>
        <CountTo endVal={counts.commitCount} />
        Commits
      </h3>
      <h4>In Total</h4>
      <hr />
      <Legend className="statistics__legend" sections={sections} />
      <Bar sections={sections} />
    </Card>
  );
}
