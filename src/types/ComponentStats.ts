import type { CommitStats, Month, Year } from './GitHubStats';

export interface DataPoint {
  title: string;
  color: string;
  value: number;
  url?: string;
}

export interface Graph extends DataPoint {
  values: number[];
}

export type Visibility = 'public' | 'private';
export type ChangeType = 'additions' | 'deletions';

export interface PrivatePublicCommitStats extends CommitStats {
  publicCommitCount: number;
  privateCommitCount: number;
  publicChangedFiles: number;
  privateChangedFiles: number;
}

export type MonthYearKey = `${Year}-${Month}`;

export interface NpmPackageStats {
  downloads: number;
  versions: number;
}

export interface NpmOrganizationStats extends NpmPackageStats {
  packages: number;
}
