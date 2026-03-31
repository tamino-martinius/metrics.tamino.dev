import { useState, JSX } from 'react';
import { Graph } from '@/types';
import Card from '@/components/Card';
import ButtonGroup from '@/components/ButtonGroup';
import Legend from '@/components/Legend';
import { scaleLinear, area, line, curveBasis } from 'd3';

export enum ChartType {
  LINES = 'chart--lines',
  STACKED = 'chart--stacked',
  COMPARE = 'chart--compare',
}

const CHART_WIDTH = 840;
const CHART_HEIGHT = 200;

interface ChartProps {
  graphs: Graph[];
  title: string;
  xLabels: string[];
  type?: ChartType;
  className?: string;
}

export default function Chart({ graphs: graphsProp, title, xLabels, type, className }: ChartProps) {
  const [currentType, setCurrentType] = useState(type || ChartType.STACKED);

  const classes = [className, currentType].filter(Boolean).join(' ');
  const graphs: Graph[] = graphsProp.map(graph => ({
    title: graph.title,
    color: graph.color,
    value: graph.value,
    values: graph.values.slice(0),
  }));

  const xMax = Math.max(...graphs.map(graph => graph.values.length));
  let y0 = Array.from({ length: xMax }).map(() => 0);
  if (currentType === ChartType.STACKED) {
    for (let i = 1; i < graphs.length; i += 1) {
      graphs[i].values = graphs[i].values.map(
        (y, x) => y + graphs[i - 1].values[x] || 0,
      );
    }
  }
  const yMax = Math.max(...graphs.map(graph =>
    Math.max(...graph.values),
  ));

  const xScale = scaleLinear().domain([0, xMax - 1]).range([0, CHART_WIDTH]);
  const yScaleComplete = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT, 0]);
  const yScaleTop = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT / 2, 0]);
  const yScaleBottom = scaleLinear().domain([0, yMax]).range([CHART_HEIGHT / 2, CHART_HEIGHT]);

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

  const graphElements: JSX.Element[] = [];
  for (let i = 0; i < graphs.length; i += 1) {
    const graph = graphs[i];
    graphElements.push(
      <path
        key={`area-${i}`}
        className="chart__area"
        d={createArea(graph.values, i) || undefined}
        style={{ '--color': `var(--${graph.color})` } as React.CSSProperties}
      />,
      <path
        key={`line-${i}`}
        className="chart__graph"
        d={createPath(graph.values, i) || undefined}
        style={{ '--color': `var(--${graph.color})` } as React.CSSProperties}
      />,
    );
    if (currentType === ChartType.STACKED) {
      y0 = graph.values;
    }
  }

  let divider: JSX.Element | undefined;
  let typeToggle: JSX.Element | undefined;

  if (currentType === ChartType.COMPARE) {
    divider = (
      <path
        className="chart__divider"
        d={`M0,${~~(CHART_HEIGHT / 2)}L${CHART_WIDTH},${~~(CHART_HEIGHT / 2)}`}
      />
    );
  } else {
    typeToggle = (
      <ButtonGroup
        labels={['Lines', 'Stacked']}
        values={[ChartType.LINES, ChartType.STACKED]}
        onValueChanged={setCurrentType}
      />
    );
  }

  const xAxisLabels = xLabels.map((label, i) => (
    <label key={i}>{label}</label>
  ));

  return (
    <Card className={classes} title={title} titleSlot={typeToggle} footerSlot={<Legend sections={graphsProp} />}>
      <div className="chart__grid">
        <div className="chart__canvas chart--faded">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            width={`${CHART_WIDTH}px`}
            height={`${CHART_HEIGHT}px`}
          >
            {graphElements}
            {divider}
          </svg>
        </div>
        <div className="chart__axis chart__axis--x">
          {xAxisLabels}
        </div>
      </div>
    </Card>
  );
}
