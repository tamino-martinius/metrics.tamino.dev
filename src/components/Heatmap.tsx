import { useMemo } from 'react';
import type { Dict } from '@/types/ComponentStats';

interface HeatmapProps {
  year: string;
  counts: (number | undefined)[];
  max: number;
}

export default function Heatmap({ year, counts, max }: HeatmapProps) {
  const colors = useMemo(() => {
    let colorIndex = 2;
    let colorLimit = ~~(max / 2);
    const colors: Dict<string> = {};
    for (let i = max; i > 0; i -= 1) {
      colors[i.toString()] = `color-${colorIndex}`;
      if (i === colorLimit) {
        colorIndex = Math.min(7, colorIndex + 1);
        colorLimit = ~~(colorLimit / 2);
      }
    }
    colors['0'] = 'color-0';
    return colors;
  }, [max]);

  const cells = counts.map((count, i) => (
    <div
      key={i}
      className="heatmap__cell"
      style={
        {
          '--color': `var(--${
            count === undefined ? 'color-empty' : colors[count.toString()]
          })`,
        } as React.CSSProperties
      }
    />
  ));

  const offset = new Date(year).getDay();
  const offsetCells = [];
  for (let i = 0; i < offset; i += 1) {
    offsetCells.push(<div key={`offset-${i}`} />);
  }

  const legendColors = ['color-0'];
  for (let i = 7; i > 0; i -= 1) {
    legendColors.push(`color-${i}`);
  }

  const legendCells = legendColors.map((color, i) => (
    <div
      key={i}
      className="heatmap__cell"
      style={{ '--color': `var(--${color})` } as React.CSSProperties}
    />
  ));

  return (
    <div className="heatmap">
      <div className="heatmap__grid">
        {offsetCells}
        {cells}
      </div>
      <div className="heatmap__legend">
        <div>less</div>
        {legendCells}
        <div>more</div>
      </div>
    </div>
  );
}
