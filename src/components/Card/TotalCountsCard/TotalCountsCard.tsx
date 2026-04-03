import { Bar } from '@/components/shared/Bar';
import { Card } from '@/components/shared/Card';
import { CountTo } from '@/components/shared/CountTo';
import { Legend } from '@/components/shared/Legend';
import type { DataPoint } from '@/types/ComponentStats';
import './TotalCountsCard.css';
import { type FC, memo } from 'react';
import type Data from '@/models/Data';

interface TotalCountsCardProps {
  data: Data;
}

export const TotalCountsCard: FC<TotalCountsCardProps> = memo(({ data }) => {
  const { commitStatTotals } = data;

  const additions: DataPoint = {
    color: 'color-additions',
    title: 'Additions',
    value: commitStatTotals.additions,
  };
  const deletions: DataPoint = {
    color: 'color-deletions',
    title: 'Deletions',
    value: commitStatTotals.deletions,
  };
  const changedFiles: DataPoint = {
    color: 'color-1',
    title: 'Changed Files',
    value: commitStatTotals.changedFiles,
  };

  return (
    <Card title="Total Counts" className="total-counts-card">
      <h3>
        <CountTo inline endVal={commitStatTotals.commitCount} /> Commits
      </h3>
      <h4>In Total</h4>
      <hr />
      <Legend className="total-counts-card__legend" sections={[additions, deletions, changedFiles]} />
      <Bar sections={[additions, deletions]} />
    </Card>
  );
});
