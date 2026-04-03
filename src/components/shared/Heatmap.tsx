import { type FC, memo } from 'react';
import type { Year } from '@/types/GitHubStats';
import './Heatmap.css';

interface HeatmapProps {
  year: Year;
  counts: (number | undefined)[];
  startTimestamp: number;
  endTimestamp: number;
  colorCount?: number;
}

const DEFAULT_COLOR_COUNT = 7;

export const Heatmap: FC<HeatmapProps> = memo(
  ({ year, counts, startTimestamp, endTimestamp, colorCount = DEFAULT_COLOR_COUNT }) => {
    const maxCount = Math.max(...counts.filter((count) => count !== undefined));

    const countColors = counts.map((count, i) => {
      const isInFuture = new Date(year.toString()).setDate(i + 1) > endTimestamp;
      const isInPast = new Date(year.toString()).setDate(i + 1) < startTimestamp;
      return isInFuture || isInPast
        ? 'color-empty'
        : count === undefined
          ? 'color-0'
          : `color-${colorCount - Math.floor(((count ?? 0) / maxCount) * colorCount)}`;
    });

    const totalCells = 53 * 7;
    const offsetCount = new Date(year.toString()).getDay();
    const offsetColors = Array.from({ length: offsetCount }, () => 'color-empty');

    const fillCount = totalCells - offsetCount - countColors.length;
    const fillColors = Array.from({ length: fillCount }, () => 'color-empty');

    const heatmapColors = [...offsetColors, ...countColors, ...fillColors];
    const heatmapCells = heatmapColors.map((color, i) => (
      <div
        key={`heatmap-cell-${i}`}
        className="heatmap__cell"
        style={{ '--color': `var(--${color})` } as React.CSSProperties}
      />
    ));

    const legendColors = ['color-0', ...Array.from({ length: colorCount }, (_, i) => `color-${i + 1}`).reverse()];
    const legendCells = legendColors.map((color, i) => (
      <div
        key={`legend-cell-${i}`}
        className="heatmap__cell"
        style={{ '--color': `var(--${color})` } as React.CSSProperties}
      />
    ));

    return (
      <div className="heatmap">
        <div className="heatmap__grid">{heatmapCells}</div>
        <div className="heatmap__legend">
          <div>less</div>
          {legendCells}
          <div>more</div>
        </div>
      </div>
    );
  },
);
