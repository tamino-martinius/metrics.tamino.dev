import type { ChangeType, Visibility } from './types/ComponentStats';
import type { Hour, HourKey, Month, Weekday } from './types/GitHubStats';

export const VISIBILITIES: Visibility[] = ['public', 'private'];
export const VISIBILITY_TITLES = ['Public', 'Private'] as const;

export const CHANGE_TYPES: ChangeType[] = ['additions', 'deletions'];
export const CHANGE_TYPE_TITLES = ['Additions', 'Deletions'] as const;

export const MONTH_TITLES_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
export const MONTH_TITLES_SHORT = MONTH_TITLES_LONG.map((title) => title.substring(0, 3));
export const MONTHS: Month[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export const WEEKDAY_TITLES_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
export const WEEKDAY_TITLES_SHORT: Weekday[] = WEEKDAY_TITLES_LONG.map((title) => title.substring(0, 3) as Weekday);
export const WEEKDAYS: Weekday[] = WEEKDAY_TITLES_SHORT;

export const HOURS: Hour[] = Array.from({ length: 24 }).map((_, i) => (i + 1).toString().padStart(2, '0') as Hour);
export const HOUR_TITLES: string[] = HOURS.map((hour) => `${hour}:00`);

export const HOUR_KEYS = WEEKDAY_TITLES_SHORT.flatMap((weekday) =>
  HOURS.map((hour) => `${weekday}, ${hour}` satisfies HourKey),
);

const dayMonthFormatter = new Intl.DateTimeFormat('en-CA', { day: '2-digit', month: '2-digit' });

export const NON_LEAP_YEAR = 2026;
export const DATE_KEYS: string[] = [];
for (
  const date = new Date(NON_LEAP_YEAR.toString());
  date.getFullYear() <= NON_LEAP_YEAR;
  date.setDate(date.getDate() + 1)
) {
  DATE_KEYS.push(dayMonthFormatter.format(date));
}

export const LEAP_YEAR = 2024;
export const LEAP_YEAR_DATE_KEYS: string[] = [];
for (const date = new Date(LEAP_YEAR.toString()); date.getFullYear() <= LEAP_YEAR; date.setDate(date.getDate() + 1)) {
  LEAP_YEAR_DATE_KEYS.push(dayMonthFormatter.format(date));
}
