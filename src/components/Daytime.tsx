import Chart from '@/components/Chart';
import { Dict, Graph, WeekDayStats } from '@/types';

interface DaytimeProps {
  weekDays: Dict<WeekDayStats>;
}

export default function Daytime({ weekDays }: DaytimeProps) {
  const titles = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  const hours = Array.from({ length: 24 }).map((_x, i) => i);
  const graphs: Graph[] = Object.values(weekDays).map((stats, i) => ({
    title: titles[i],
    color: `color-${i + 1}`,
    value: stats.commitCount,
    values: hours.map(
      hour => (stats.hours[hour.toString()] && stats.hours[hour.toString()].commitCount) || 0,
    ),
  }));

  const xLabels = [
    '1:00 AM', '3:00 AM', '5:00 AM', '7:00 AM', '9:00 AM', '11:00 AM',
    '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM', '11:00 PM',
  ];

  return (
    <Chart
      className="daytime"
      title="Daytime"
      graphs={graphs}
      xLabels={xLabels}
    />
  );
}
