export type Year = number;
export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type Day =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31';
export type DateKey = `${Year}-${Month}-${Day}`;

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Hour =
  | '00'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23';
export type HourKey = `${Weekday}, ${Hour}`;

export interface CommitStats {
  commitCount: number;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export type CommitsPerDate = Partial<Record<DateKey, CommitStats>>;
export type CommitsPerHour = Partial<Record<HourKey, CommitStats>>;

export interface PublicRepositoryDetails {
  name: string;
  url: string;
  languages: string[];
  description: string;
  stargazerCount: number;
  forkCount: number;
}

export interface RepositoryStats {
  public?: PublicRepositoryDetails; // only present for public repos
  commitsPerDate: CommitsPerDate; // yyyy-MM-dd
  commitsPerHour: CommitsPerHour; // ddd, hh
}

export type CommentsPerDate = Partial<Record<DateKey, number>>;
export type CommentsPerHour = Partial<Record<HourKey, number>>;

export interface UserStats {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  url: string;
  gistCount: number;
  followerCount: number;
  followingCount: number;
  commentsPerDate: CommentsPerDate; // yyyy-MM-dd
  commentsPerHour: CommentsPerHour; // ddd, hh
}

export type Organizations = Record<string, { avatarUrl: string; url: string }>;

export interface AccountStats {
  user: UserStats;
  organizations: Organizations;
  languageColors: { [key: string]: string };
  repositories: RepositoryStats[];
}
