import { useState } from 'react';
import Bar from '@/components/Bar';
import ButtonGroup from '@/components/ButtonGroup';
import Card from '@/components/Card';
import Heatmap from '@/components/Heatmap';
import Legend from '@/components/Legend';
import type { Counts, DataPoint, Dict } from '@/types/ComponentStats';

interface YearlyStatisticsProps {
  dates: Dict<Counts>;
  repos: Dict<{ commitCount: number; years: Dict<Counts> }>;
}

export default function YearlyStatistics({
  dates,
  repos,
}: YearlyStatisticsProps) {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const reposOfYear: Dict<Counts> = {};
  for (const repoKey in repos) {
    const repo = repos[repoKey];
    if (repo.years[year]) reposOfYear[repoKey] = repo.years[year];
  }

  function getSections(totalCommits: number) {
    let othersSum = totalCommits;
    const repoKeys = Object.keys(reposOfYear);
    repoKeys.sort(
      (key1, key2) =>
        reposOfYear[key2].commitCount - reposOfYear[key1].commitCount,
    );
    const sections: DataPoint[] = [];
    for (let i = 0; i < repoKeys.length && i < 6; i += 1) {
      const section = {
        color: `color-${i + 1}`,
        title: repoKeys[i].split('/')[1],
        value: reposOfYear[repoKeys[i]].commitCount,
      };
      othersSum -= section.value;
      sections.push(section);
    }
    if (othersSum > 0) {
      sections.push({
        color: 'color-7',
        title: 'All Others',
        value: othersSum,
      });
    }
    return sections;
  }

  const years: string[] = [];
  for (let y = 2013; y <= new Date().getFullYear(); y += 1) {
    years.push(y.toString());
  }

  const startDate = new Date(year);
  const date = new Date(startDate);
  const endDate = new Date(parseInt(year, 10), 11, 31, 23, 59, 59);
  const keys: (string | undefined)[] = [];
  const today = new Date();
  while (date <= endDate) {
    if (date > today) {
      keys.push(undefined);
    } else {
      keys.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    }
    date.setDate(date.getDate() + 1);
  }
  const counts: (number | undefined)[] = [];
  let totalCommits = 0;
  const max = Object.values(dates).reduce(
    (max, d) => Math.max(max, d.commitCount),
    0,
  );
  for (const key of keys) {
    if (key) {
      const count = dates[key]?.commitCount || 0;
      counts.push(count);
      totalCommits += count;
    } else {
      counts.push(undefined);
    }
  }
  const sections = getSections(totalCommits);

  return (
    <Card
      title="Yearly Statistics"
      className="yearly-statistics"
      titleSlot={<ButtonGroup labels={years} onValueChanged={setYear} />}
    >
      <h3>Year {year}</h3>
      <h4>{totalCommits.toLocaleString()} Commits</h4>
      <hr />
      <h3 className="yearly-statistics__highlights">Highlights</h3>
      <Heatmap counts={counts} year={year} max={max} />
      <Legend className="yearly-statistics__legend" sections={sections} />
      <Bar sections={sections} />
    </Card>
  );
}
