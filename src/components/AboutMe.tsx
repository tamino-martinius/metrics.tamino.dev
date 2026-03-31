import Card from '@/components/Card';
import Legend from '@/components/Legend';
import { Dict, Counts, DataPoint } from '@/types';

interface AboutMeProps {
  languages: Dict<Counts>;
  counts: Counts;
}

export default function AboutMe({ languages, counts }: AboutMeProps) {
  const ruby = languages.Ruby.commitCount / counts.commitCount;
  const js = languages.JavaScript.commitCount / counts.commitCount;
  const ts = languages.TypeScript.commitCount / counts.commitCount;
  const html = languages.HTML.commitCount / counts.commitCount;
  const sections: DataPoint[] = [
    { color: 'color-2', title: 'JavaScript', value: js },
    { color: 'color-4', title: 'HTML', value: html },
    { color: 'color-1', title: 'Ruby', value: ruby },
    { color: 'color-3', title: 'TypeScript', value: ts },
  ];

  return (
    <Card
      title="Tamino Martinius"
      className="about-me"
      titleSlot={
        <img
          src="https://avatars3.githubusercontent.com/u/3111766?s=50&v=4"
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
      <Legend decimals={2} className="about-me__legend" sections={sections} columns="1fr 1fr" />
    </Card>
  );
}
