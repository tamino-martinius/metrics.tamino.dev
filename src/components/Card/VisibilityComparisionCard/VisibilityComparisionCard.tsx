import { type FC, memo } from 'react';
import { PieChartComparisonCard } from '@/components/shared/PieChartComparisonCard';
import { VISIBILITIES, VISIBILITY_TITLES } from '@/constants';
import type Data from '@/models/Data';
import type { DataPoint } from '@/types/ComponentStats';
import { visibilityCommitKey } from '@/util/recordKey';
import './VisibilityComparisionCard.css';

interface VisibilityComparisionCardProps {
  data: Data;
}

export const VisibilityComparisionCard: FC<VisibilityComparisionCardProps> = memo(({ data }) => {
  const { commitStatTotals } = data;

  const sections: [DataPoint, DataPoint] = [
    {
      color: `color-${VISIBILITIES[0]}`,
      title: VISIBILITY_TITLES[0],
      value: commitStatTotals[visibilityCommitKey(VISIBILITIES[0])],
    },
    {
      color: `color-${VISIBILITIES[1]}`,
      title: VISIBILITY_TITLES[1],
      value: commitStatTotals[visibilityCommitKey(VISIBILITIES[1])],
    },
  ];

  return <PieChartComparisonCard title="Visibility Comparison" className="visibility-comparison-card" sections={sections} />;
});
