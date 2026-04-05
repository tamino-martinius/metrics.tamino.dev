type Year = number;
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day =
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

type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type Hour =
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

export type DownloadsPerDate = Partial<Record<DateKey, number>>;

export type VersionsPerDate = Partial<Record<DateKey, number>>;
export type VersionsPerHour = Partial<Record<HourKey, number>>;

export interface PackageDetails {
  name: string;
  description: string;
  latestVersion: string;
  license: string;
  keywords: string[];
  links: {
    npm?: string;
    homepage?: string;
    repository?: string;
    bugs?: string;
  };
}

export interface PackageStats {
  details: PackageDetails;
  downloadsPerDate: DownloadsPerDate;
  versionsPerDate: VersionsPerDate;
  versionsPerHour: VersionsPerHour;
}

export interface UserStats {
  username: string;
  versionsPerDate: VersionsPerDate;
  versionsPerHour: VersionsPerHour;
}

export interface AccountStats {
  user: UserStats;
  packages: PackageStats[];
}
