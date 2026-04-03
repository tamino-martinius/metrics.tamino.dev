import type { FC } from 'react';
import type { AccountStats } from '@/types/GitHubStats';

interface BioProps {
  accountStats: AccountStats;
}

const userLinkRegex = /@([a-zA-Z0-9-]+)/g;

export const Bio: FC<BioProps> = ({ accountStats }) => {
  const bio = accountStats.user.bio;

  if (!bio) return null;

  const parts = bio.split(userLinkRegex);

  return (
    <h3>
      {parts.map((part, idx) => {
        // Even parts are text and odd parts are user links
        const isUserLink = idx % 2 === 1;
        if (isUserLink) {
          return (
            <a
              href={`https://github.com/${part}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{part}
            </a>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </h3>
  );
};
