import { type FC, memo } from 'react';
import { Card } from '@/components/shared/Card';
import { Legend } from '@/components/shared/Legend';
import type { DataPoint } from '@/types/ComponentStats';
import { Bio } from './Bio';
import './UserCard.css';
import type Data from '@/models/Data';

interface UserCardProps {
  data: Data;
}

export const UserCard: FC<UserCardProps> = memo(({ data }) => {
  const { commitsPerLanguage, commitStatTotals, user } = data;

  if (!user) return null;

  const topLanguages: DataPoint[] = Object.entries(commitsPerLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([language, commitCount], i) => ({
      color: `color-${i + 1}`,
      title: language,
      value: commitCount / commitStatTotals.commitCount,
    }));

  return (
    <Card
      title={user.name}
      className="user-card"
      titleSlot={<img src={user.avatarUrl} alt={user.name} className="user-card__avatar" />}
    >
      <Bio user={user} />
      <hr />
      <Legend decimals={2} className="user-card__legend" sections={topLanguages} columns="1fr 1fr" />
    </Card>
  );
});
