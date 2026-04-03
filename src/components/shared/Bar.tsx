import { type FC, memo } from 'react';
import type { DataPoint } from '@/types/ComponentStats';
import './Bar.css';

export enum BarType {
  HORIZONTAL = 'bar--horizontal',
  VERTICAL = 'bar--vertical',
}

interface BarProps {
  sections: DataPoint[];
  sectionCount?: number;
  type?: BarType;
  style?: React.CSSProperties;
}

export const Bar: FC<BarProps> = memo(({ sections, sectionCount, type, style }) => {
  const barType = type || BarType.HORIZONTAL;

  const sectionElements = sections.map((data, i) => (
    <div
      key={i}
      className={['bar__section', barType].join(' ')}
      style={{ '--color': `var(--${data.color})` } as React.CSSProperties}
    >
      {data.value.toLocaleString()}
    </div>
  ));

  const weights = sections.map((data) => `${data.value}fr`);
  if (sectionCount && sectionCount > sections.length) {
    weights.push(...Array.from({ length: sectionCount - sections.length }, () => '0fr'));
  }
  const template = barType === BarType.HORIZONTAL ? 'gridTemplateColumns' : 'gridTemplateRows';

  return (
    <div className="bar" style={{ [template]: weights.join(' '), ...style }}>
      {sectionElements}
    </div>
  );
});
