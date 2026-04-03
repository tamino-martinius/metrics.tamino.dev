import { DATE_KEYS, LEAP_YEAR_DATE_KEYS, MONTHS } from '@/constants';
import type { ChangeType, MonthYearKey, PrivatePublicCommitStats, Visibility } from '@/types/ComponentStats';
import type { DateKey, Day, Hour, HourKey, Month, Weekday, Year } from '@/types/GitHubStats';

export const splitDateKey = (dateKey: DateKey): [Year, Month, Day] => {
  const [year, month, day] = dateKey.split('-');
  return [parseInt(year, 10) as Year, month as Month, day as Day];
};

export const joinDateKey = (year: Year, month: Month, day: Day) => `${year}-${month}-${day}` as DateKey;

export const splitHourKey = (hourKey: HourKey) => hourKey.split(', ') as [Weekday, Hour];

export const joinHourKey = (weekday: Weekday, hour: Hour) => `${weekday}, ${hour}` as HourKey;

export const visibilityCommitKey = (visibility: Visibility): keyof PrivatePublicCommitStats =>
  visibility === 'public' ? 'publicCommitCount' : 'privateCommitCount';

export const visibilityChangedFilesKey = (visibility: Visibility): keyof PrivatePublicCommitStats =>
  visibility === 'public' ? 'publicChangedFiles' : 'privateChangedFiles';

export const changeTypeCommitKey = (changeType: ChangeType): keyof PrivatePublicCommitStats => changeType;

/** Gregorian calendar: leap if divisible by 4, except century years unless divisible by 400. */
export const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const getDateKeysForYear = (year: Year): DateKey[] => {
  const keys = isLeapYear(year) ? LEAP_YEAR_DATE_KEYS : DATE_KEYS;
  return keys.map((dateKey) => `${year}-${dateKey}` as DateKey);
};

export const getMonthYearKeysForYear = (year: Year): MonthYearKey[] => {
  return MONTHS.map((month) => `${year}-${month}` as MonthYearKey);
};
