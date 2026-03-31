import { DataPoint } from '@/types';
export type { DataPoint } from '@/types';
import CountTo from '@/components/CountTo';

interface LegendProps {
  sections: DataPoint[];
  columns?: string;
  decimals?: number;
  className?: string;
}

export default function Legend({ sections, columns, decimals, className }: LegendProps) {
  const gridTemplateColumns = columns || sections.map(() => '1fr').join(' ');

  const legends = sections.map((data, i) => (
    <div key={i}>
      <div className="legend__color" style={{ '--color': `var(--${data.color})` } as React.CSSProperties} />
      <div className="legend__title">
        {data.title}
      </div>
      <div className="legend__value">
        <CountTo
          decimals={decimals}
          duration={Math.random() * 1000 + 500}
          endVal={data.value < 1 ? data.value * 100 : data.value}
          suffix={data.value < 1 ? ' %' : ''}
        />
      </div>
    </div>
  ));

  return (
    <div className={['legend', className].filter(Boolean).join(' ')} style={{ gridTemplateColumns }}>
      {legends}
    </div>
  );
}
