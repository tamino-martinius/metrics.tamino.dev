import { type FC, memo } from 'react';
import { PieChartComparisonCard } from '@/components/shared/PieChartComparisonCard';
import type Data from '@/models/Data';
import type { DataPoint } from '@/types/ComponentStats';
import './FollowersCard.css';

interface FollowersCardProps {
  data: Data;
}

export const FollowersCard: FC<FollowersCardProps> = memo(({ data }) => {
  const user = data.user;

  const sections: [DataPoint, DataPoint] = [
    { color: 'color-followers', title: 'Followers', value: user?.followerCount ?? 0 },
    { color: 'color-following', title: 'Following', value: user?.followingCount ?? 0 },
  ];

  return <PieChartComparisonCard title="Followers vs Following" className="followers-card" sections={sections} />;
});
