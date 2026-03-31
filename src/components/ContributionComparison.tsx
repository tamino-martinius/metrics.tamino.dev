import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { CommitSplit, DataPoint, Counts } from '@/types';

const ANGLE_START = 0;
const ANGLE_END = 360;
const ANGLE_GAP = 1;
const SVG_SIZE = 160;
const STROKE_WIDTH = 3;
const HOVER_WIDTH = 10 + STROKE_WIDTH;

interface ContributionComparisonProps {
  counts: CommitSplit<Counts>;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
  ].join(' ');
  return d;
}

export default function ContributionComparison({ counts }: ContributionComparisonProps) {
  const valueOpen = counts.open.commitCount / counts.sum.commitCount;
  const valueClosed = counts.closed.commitCount / counts.sum.commitCount;
  const angle = valueOpen * 360;

  const sections: DataPoint[] = [
    { color: 'color-open', title: 'Open Source', value: valueOpen },
    { color: 'color-closed', title: 'Private', value: valueClosed },
  ];

  const classPath = 'contribution-comparison__path';
  const classOpen = 'contribution-comparison__path--open';
  const classClosed = 'contribution-comparison__path--closed';
  const classHover = 'contribution-comparison__path--hover';

  return (
    <Card title="Contribution Comparison" className="contribution-comparison">
      <Legend sections={sections} />
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width={`${SVG_SIZE}px`}
        height={`${SVG_SIZE}px`}
      >
        <path
          className={[classPath, classOpen].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - STROKE_WIDTH / 2,
            ANGLE_START + ANGLE_GAP, angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classOpen, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - HOVER_WIDTH / 2,
            ANGLE_START + ANGLE_GAP, angle - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed].join(' ')}
          style={{ strokeWidth: `${STROKE_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - STROKE_WIDTH / 2,
            angle + ANGLE_GAP, ANGLE_END - ANGLE_GAP,
          )}
        />
        <path
          className={[classPath, classClosed, classHover].join(' ')}
          style={{ strokeWidth: `${HOVER_WIDTH}px` }}
          d={describeArc(
            SVG_SIZE / 2, SVG_SIZE / 2, SVG_SIZE / 2 - HOVER_WIDTH / 2,
            angle + ANGLE_GAP, ANGLE_END - ANGLE_GAP,
          )}
        />
      </svg>
    </Card>
  );
}
