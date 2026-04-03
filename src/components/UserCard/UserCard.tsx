import type { FC } from 'react';
import Card from '@/components/Card';
import Legend from '@/components/Legend';
import type { DataPoint } from '@/types/ComponentStats';
import type { AccountStats } from '@/types/GitHubStats';
import { Bio } from './Bio';
import { getLanguageUsage } from './getLanguageUsage';
import './UserCard.css';

interface UserCardProps {
  accountStats: AccountStats;
}

export const UserCard: FC<UserCardProps> = ({ accountStats }) => {
  const languageUsage = getLanguageUsage(accountStats);

  const topLanguages: DataPoint[] = languageUsage
    .slice(0, 4)
    .map(({ language, percentage }, i) => ({
      color: `color-${i + 1}`,
      title: language,
      value: percentage,
    }));
  return (
    <Card
      title={accountStats.user.name}
      className="user-card"
      titleSlot={
        <img
          src={accountStats.user.avatarUrl}
          alt={accountStats.user.name}
          className="user-card__avatar"
        />
      }
    >
      <Bio accountStats={accountStats} />
      <hr />
      <Legend
        decimals={2}
        className="user-card__legend"
        sections={topLanguages}
        columns="1fr 1fr"
      />
    </Card>
  );
};
