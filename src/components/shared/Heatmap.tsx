import { type FC, memo } from 'react';
import type { Year } from '@/types/GitHubStats';
import './Heatmap.css';

interface HeatmapProps {
  year: Year;
  counts: (number | undefined)[];
  colorCount?: number;
}

const DEFAULT_COLOR_COUNT = 7;

export const Heatmap: FC<HeatmapProps> = memo(({ year, counts, colorCount = DEFAULT_COLOR_COUNT }) => {
  const maxCount = Math.max(...counts.filter((count) => count !== undefined));

  const cells = counts.map((count, i) => {
    const isInFuture = new Date(year.toString()).setDate(i + 1) > Date.now();
    const color = isInFuture
      ? 'color-empty'
      : count === undefined
        ? 'color-0'
        : `color-${colorCount - Math.floor(((count ?? 0) / maxCount) * colorCount)}`;
    return (
      <div
        key={i}
        className="heatmap__cell"
        style={
          {
            '--color': `var(--${color})`,
          } as React.CSSProperties
        }
      />
    );
  });

  const offsetCount = new Date(year.toString()).getDay();
  const offsetCells = Array.from({ length: offsetCount }, (_, i) => (
    <div
      key={`offset-${i}`}
      className="heatmap__cell"
      style={{ '--color': 'var(--color-empty)' } as React.CSSProperties}
    />
  ));

  const fillCount = 7 - ((cells.length + offsetCount) % 7);
  const fillCells = Array.from({ length: fillCount }, (_, i) => (
    <div
      key={`fill-${i}`}
      className="heatmap__cell"
      style={{ '--color': 'var(--color-empty)' } as React.CSSProperties}
    />
  ));

  const legendColors = ['color-0', ...Array.from({ length: colorCount }, (_, i) => `color-${i + 1}`).reverse()];
  const legendCells = legendColors.map((color, i) => (
    <div key={i} className="heatmap__cell" style={{ '--color': `var(--${color})` } as React.CSSProperties} />
  ));

  return (
    <div className="heatmap">
      <div className="heatmap__grid">
        {offsetCells}
        {cells}
        {fillCells}
      </div>
      <div className="heatmap__legend">
        <div>less</div>
        {legendCells}
        <div>more</div>
      </div>
    </div>
  );
});
