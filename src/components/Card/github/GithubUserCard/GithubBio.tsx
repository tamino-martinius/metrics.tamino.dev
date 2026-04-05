import { type FC, memo } from 'react';
import type { UserStats } from '@/types/GitHubStats';

interface GithubBioProps {
  user: UserStats;
}

const userLinkRegex = /@([a-zA-Z0-9-]+)/g;

export const GithubBio: FC<GithubBioProps> = memo(({ user }) => {
  const bio = user.bio;

  if (!bio) return null;

  const parts = bio.split(userLinkRegex);

  return (
    <h4>
      {parts.map((part, idx) => {
        // Even parts are text and odd parts are user links
        const isUserLink = idx % 2 === 1;
        if (isUserLink) {
          return (
            <a href={`https://github.com/${part}`} target="_blank" rel="noopener noreferrer">
              @{part}
            </a>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </h4>
  );
});
