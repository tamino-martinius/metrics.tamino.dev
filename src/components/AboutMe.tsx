import Card from '@/components/Card';
import Legend from '@/components/Legend';
import type { Counts, DataPoint, Dict } from '@/types/ComponentStats';

interface AboutMeProps {
  languages: Dict<Counts>;
}

export default function AboutMe({ languages }: AboutMeProps) {
  // Sort languages by commit count, take top 4
  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b.commitCount - a.commitCount)
    .slice(0, 4);

  // Use public commit total (sum of all language commit counts) as denominator
  const totalLangCommits = Object.values(languages).reduce(
    (sum, l) => sum + l.commitCount,
    0,
  );

  const sections: DataPoint[] = topLanguages.map(([lang, langCounts], i) => ({
    color: `color-${i + 1}`,
    title: lang,
    value: langCounts.commitCount / totalLangCommits,
  }));

  return (
    <Card
      title="Tamino Martinius"
      className="about-me"
      titleSlot={
        <img
          src="https://avatars3.githubusercontent.com/u/3111766?s=50&v=4"
          alt="Tamino Martinius"
          className="about-me__avatar"
        />
      }
    >
      <h3>I speak code</h3>
      <h4>
        Head of Development
        <a href="https://shyftplan.com/en/?utm_source=tamino&utm_campaign=contributions">
          &nbsp;@shyftplan
        </a>
      </h4>
      <hr />
      <Legend
        decimals={2}
        className="about-me__legend"
        sections={sections}
        columns="1fr 1fr"
      />
    </Card>
  );
}
