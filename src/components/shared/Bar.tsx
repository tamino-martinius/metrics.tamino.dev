import { type FC, memo } from 'react';
import type { DataPoint } from '@/types/ComponentStats';
import './Bar.css';

export enum BarType {
  HORIZONTAL = 'bar--horizontal',
  VERTICAL = 'bar--vertical',
}

interface BarProps {
  sections: DataPoint[];
  type?: BarType;
  style?: React.CSSProperties;
}

export const Bar: FC<BarProps> = memo(({ sections, type, style }) => {
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

  const weights = sections.map((data) => `${data.value}fr`).join(' ');
  const template = barType === BarType.HORIZONTAL ? 'gridTemplateColumns' : 'gridTemplateRows';

  return (
    <div className="bar" style={{ [template]: weights, ...style }}>
      {sectionElements}
    </div>
  );
});
