import { area, curveBasis, line, scaleLinear, scaleSymlog } from 'd3';
import { type FC, type JSX, useState } from 'react';
import { ButtonGroup } from '@/components/shared/ButtonGroup';
import { Card } from '@/components/shared/Card';
import { Legend } from '@/components/shared/Legend';
import type { Graph } from '@/types/ComponentStats';
import './Chart.css';

export enum ChartType {
  LINES = 'chart--lines',
  STACKED = 'chart--stacked',
  COMPARE = 'chart--compare',
}

const CHART_WIDTH = 840;
const CHART_HEIGHT = 200;

/** `symlog` is log-like but supports zeros (unlike a strict log scale). */
export type ChartYScale = 'linear' | 'symlog';

interface ChartProps {
  graphs: Graph[];
  title: string;
  xLabels: string[] | readonly string[];
  type?: ChartType;
  className?: string;
  /** Y-axis mapping; symlog compresses large values like a log scale while keeping 0 valid. */
  yScale?: ChartYScale;
  titleSlot?: JSX.Element;
  /** Index where real data ends and projections begin. Values from this index onward render with dashed lines. */
  projectionStartIndex?: number;
}

export const Chart: FC<ChartProps> = ({
  graphs: graphsProp,
  title,
  xLabels,
  type,
  className,
  yScale = 'linear',
  titleSlot,
  projectionStartIndex,
}) => {
  const [currentType, setCurrentType] = useState(type || ChartType.STACKED);

  const classes = [className, currentType].filter(Boolean).join(' ');
  const graphs: Graph[] = graphsProp.map((graph) => ({
    title: graph.title,
    color: graph.color,
    value: graph.value,
    values: graph.values.slice(0),
  }));

  const xMax = Math.max(...graphs.map((graph) => graph.values.length));
  let y0 = Array.from({ length: xMax }).map(() => 0);
  if (currentType === ChartType.STACKED) {
    for (let i = 1; i < graphs.length; i += 1) {
      graphs[i].values = graphs[i].values.map((y, x) => y + graphs[i - 1].values[x] || 0);
    }
  }
  const yMax = Math.max(...graphs.map((graph) => Math.max(...graph.values)));
  const yDomainMax = yScale === 'symlog' ? Math.max(yMax, 1) : yMax;

  const xScale = scaleLinear()
    .domain([0, xMax - 1])
    .range([0, CHART_WIDTH]);

  const makeYScale = (range: [number, number]) =>
    yScale === 'symlog'
      ? scaleSymlog().domain([0, yDomainMax]).range(range)
      : scaleLinear().domain([0, yDomainMax]).range(range);

  const yScaleComplete = makeYScale([CHART_HEIGHT, 0]);
  const yScaleTop = makeYScale([CHART_HEIGHT / 2, 0]);
  const yScaleBottom = makeYScale([CHART_HEIGHT / 2, CHART_HEIGHT]);

  const createPath = (values: number[], index: number) => {
    let yScale = yScaleComplete;
    if (currentType === ChartType.COMPARE) {
      yScale = index % 2 === 1 ? yScaleTop : yScaleBottom;
    }
    return line<number>()
      .x((_d, i) => xScale(i)!)
      .y((d) => yScale(d)!)
      .curve(curveBasis)(values);
  };

  const createArea = (values: number[], index: number) => {
    let yScale = yScaleComplete;
    if (currentType === ChartType.COMPARE) {
      yScale = index % 2 === 1 ? yScaleTop : yScaleBottom;
    }
    return area<number>()
      .x((_d, i) => xScale(i)!)
      .y0((_d, i) => yScale(y0[i] || 0)!)
      .y1((d) => yScale(d)!)
      .curve(curveBasis)(values);
  };

  const hasProjection = projectionStartIndex !== undefined && projectionStartIndex < xMax;

  const graphElements: JSX.Element[] = [];
  for (let i = 0; i < graphs.length; i += 1) {
    const graph = graphs[i];
    const colorStyle = { '--color': `var(--${graph.color})` } as React.CSSProperties;

    if (hasProjection) {
      // Past portion: solid line + normal area
      const pastValues = graph.values.slice(0, projectionStartIndex + 1);
      const pastY0 = y0.slice(0, projectionStartIndex + 1);
      const pastArea = area<number>()
        .x((_d, idx) => xScale(idx)!)
        .y0(
          (_d, idx) =>
            (currentType === ChartType.COMPARE ? (i % 2 === 1 ? yScaleTop : yScaleBottom) : yScaleComplete)(
              pastY0[idx] || 0,
            )!,
        )
        .y1((d) => (currentType === ChartType.COMPARE ? (i % 2 === 1 ? yScaleTop : yScaleBottom) : yScaleComplete)(d)!)
        .curve(curveBasis)(pastValues);

      graphElements.push(
        <path
          key={`area-past-${i}`}
          className="chart__area"
          style={{ ...colorStyle, d: `path("${pastArea}")` } as React.CSSProperties}
        />,
        <path
          key={`line-past-${i}`}
          className="chart__graph"
          style={{ ...colorStyle, d: `path("${createPath(pastValues, i)}")` } as React.CSSProperties}
        />,
      );

      // Future portion: dashed line + dimmed area (overlap by 1 point for continuity)
      const futureValues = graph.values.slice(projectionStartIndex);
      const futureY0 = y0.slice(projectionStartIndex);
      const futureXOffset = projectionStartIndex;
      const futureArea = area<number>()
        .x((_d, idx) => xScale(idx + futureXOffset)!)
        .y0(
          (_d, idx) =>
            (currentType === ChartType.COMPARE ? (i % 2 === 1 ? yScaleTop : yScaleBottom) : yScaleComplete)(
              futureY0[idx] || 0,
            )!,
        )
        .y1((d) => (currentType === ChartType.COMPARE ? (i % 2 === 1 ? yScaleTop : yScaleBottom) : yScaleComplete)(d)!)
        .curve(curveBasis)(futureValues);
      const futureLine = line<number>()
        .x((_d, idx) => xScale(idx + futureXOffset)!)
        .y((d) => (currentType === ChartType.COMPARE ? (i % 2 === 1 ? yScaleTop : yScaleBottom) : yScaleComplete)(d)!)
        .curve(curveBasis)(futureValues);

      graphElements.push(
        <path
          key={`area-future-${i}`}
          className="chart__area chart__area--projected"
          style={{ ...colorStyle, d: `path("${futureArea}")` } as React.CSSProperties}
        />,
        <path
          key={`line-future-${i}`}
          className="chart__graph chart__graph--projected"
          style={{ ...colorStyle, d: `path("${futureLine}")` } as React.CSSProperties}
        />,
      );
    } else {
      graphElements.push(
        <path
          key={`area-${i}`}
          className="chart__area"
          style={{ ...colorStyle, d: `path("${createArea(graph.values, i)}")` } as React.CSSProperties}
        />,
        <path
          key={`line-${i}`}
          className="chart__graph"
          style={{ ...colorStyle, d: `path("${createPath(graph.values, i)}")` } as React.CSSProperties}
        />,
      );
    }
    if (currentType === ChartType.STACKED) {
      y0 = graph.values;
    }
  }

  let divider: JSX.Element | undefined;
  let typeToggle = titleSlot;

  if (currentType === ChartType.COMPARE) {
    divider = (
      <path className="chart__divider" d={`M0,${~~(CHART_HEIGHT / 2)}L${CHART_WIDTH},${~~(CHART_HEIGHT / 2)}`} />
    );
  } else if (!type) {
    // Only show Lines/Stacked toggle when type is not explicitly set
    typeToggle = (
      <ButtonGroup
        labels={['Lines', 'Stacked']}
        values={[ChartType.LINES, ChartType.STACKED]}
        onValueChanged={setCurrentType}
      />
    );
  }

  const xAxisLabels = xLabels.map((label, i) => <span key={i}>{label}</span>);

  return (
    <Card className={classes} title={title} titleSlot={typeToggle} footerSlot={<Legend sections={graphsProp} />}>
      <div className="chart__grid">
        <div className="chart__canvas chart--faded">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            width={`${CHART_WIDTH}px`}
            height={`${CHART_HEIGHT}px`}
            aria-label={title}
          >
            {graphElements}
            {divider}
          </svg>
        </div>
        <div className="chart__axis chart__axis--x">{xAxisLabels}</div>
      </div>
    </Card>
  );
};
