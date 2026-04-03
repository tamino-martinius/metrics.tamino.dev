import { Card } from '@/components/shared/Card';
import { Legend } from '@/components/shared/Legend';
import type { DataPoint } from '@/types/ComponentStats';
import './VisibilityComparisionCard.css';
import { type FC, memo } from 'react';
import { VISIBILITIES, VISIBILITY_TITLES } from '@/constants';
import type Data from '@/models/Data';
import { visibilityCommitKey } from '@/util/recordKey';

const ANGLE_START = 0;
const ANGLE_END = 360;
const ANGLE_GAP = 1;
const SVG_SIZE = 160;
const STROKE_WIDTH = 3;
const HOVER_WIDTH = 10 + STROKE_WIDTH;

interface VisibilityComparisionCardProps {
  data: Data;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
  return d;
}

export const VisibilityComparisionCard: FC<VisibilityComparisionCardProps> = memo(({ data }) => {
  const { commitStatTotals } = data;
  const publicPercentile = commitStatTotals.publicCommitCount / commitStatTotals.commitCount;
  const angle = publicPercentile * 360;
  console.log(angle);

  const sections: DataPoint[] = VISIBILITIES.map((visibility, i) => ({
    color: `color-${visibility}`,
    title: VISIBILITY_TITLES[i],
    value: commitStatTotals[visibilityCommitKey(visibility)],
  }));

  const classPath = 'visibility-comparison-card__path';
  const classOpen = 'visibility-comparison-card__path--open';
  const classClosed = 'visibility-comparison-card__path--closed';
  const classHover = 'visibility-comparison-card__path--hover';

  return (
    <Card title="Visibility Comparison" className="visibility-comparison-card">
      <Legend sections={sections} />
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width={`${SVG_SIZE}px`}
        height={`${SVG_SIZE}px`}
        aria-label="Contribution Comparison"
      >
        <path
          className={[classPath, classOpen].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2,
            SVG_SIZE / 2,
            SVG_SIZE / 2 - STROKE_WIDTH / 2,
            ANGLE_START + ANGLE_GAP,
            angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classOpen, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2,
            SVG_SIZE / 2,
            SVG_SIZE / 2 - HOVER_WIDTH / 2,
            ANGLE_START + ANGLE_GAP,
            angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2,
            SVG_SIZE / 2,
            SVG_SIZE / 2 - STROKE_WIDTH / 2,
            angle + ANGLE_GAP,
            ANGLE_END - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2,
            SVG_SIZE / 2,
            SVG_SIZE / 2 - HOVER_WIDTH / 2,
            angle + ANGLE_GAP,
            ANGLE_END - ANGLE_GAP,
          )}
        />
      </svg>
    </Card>
  );
});
