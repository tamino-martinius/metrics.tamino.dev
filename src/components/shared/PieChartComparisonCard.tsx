import { type FC, memo } from 'react';
import { Card } from '@/components/shared/Card';
import { Legend } from '@/components/shared/Legend';
import type { DataPoint } from '@/types/ComponentStats';
import './PieChartComparisonCard.css';

const SVG_SIZE = 160;
const STROKE_WIDTH = 3;
const HOVER_WIDTH = 10 + STROKE_WIDTH;

const ANGLE_START = 0;
const ANGLE_END = 360;
const ANGLE_GAP = 1;

interface PieChartComparisonCardProps {
  title: string;
  sections: [DataPoint, DataPoint];
  className?: string;
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
  return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
}

export const PieChartComparisonCard: FC<PieChartComparisonCardProps> = memo(
  ({ title, sections, className }) => {
    const [first, second] = sections;
    const total = first.value + second.value;
    const angle = total > 0 ? (first.value / total) * 360 : 180;

    const cardClass = ['pie-chart-comparison-card', className].filter(Boolean).join(' ');

    return (
      <Card title={title} className={cardClass}>
        <Legend sections={sections} />
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          width={`${SVG_SIZE}px`}
          height={`${SVG_SIZE}px`}
          aria-label={title}
        >
          <path
            className="pie-chart-comparison-card__path pie-chart-comparison-card__path--first"
            style={{ strokeWidth: `${STROKE_WIDTH}px`, stroke: `var(--${first.color})` }}
            d={describeArc(
              SVG_SIZE / 2,
              SVG_SIZE / 2,
              SVG_SIZE / 2 - STROKE_WIDTH / 2,
              ANGLE_START + ANGLE_GAP,
              angle - ANGLE_GAP,
            )}
          />
          <path
            className="pie-chart-comparison-card__path pie-chart-comparison-card__path--first pie-chart-comparison-card__path--hover"
            style={{ strokeWidth: `${HOVER_WIDTH}px`, stroke: `var(--${first.color})` }}
            d={describeArc(
              SVG_SIZE / 2,
              SVG_SIZE / 2,
              SVG_SIZE / 2 - HOVER_WIDTH / 2,
              ANGLE_START + ANGLE_GAP,
              angle - ANGLE_GAP,
            )}
          />
          <path
            className="pie-chart-comparison-card__path pie-chart-comparison-card__path--second"
            style={{ strokeWidth: `${STROKE_WIDTH}px`, stroke: `var(--${second.color})` }}
            d={describeArc(
              SVG_SIZE / 2,
              SVG_SIZE / 2,
              SVG_SIZE / 2 - STROKE_WIDTH / 2,
              angle + ANGLE_GAP,
              ANGLE_END - ANGLE_GAP,
            )}
          />
          <path
            className="pie-chart-comparison-card__path pie-chart-comparison-card__path--second pie-chart-comparison-card__path--hover"
            style={{ strokeWidth: `${HOVER_WIDTH}px`, stroke: `var(--${second.color})` }}
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
  },
);
