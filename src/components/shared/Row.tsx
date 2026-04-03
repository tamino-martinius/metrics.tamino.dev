import { type FC, memo, type ReactNode } from 'react';
import './Row.css';

export enum RowType {
  FULL = 'row--full',
  FIRST_THIRD = 'row--first-third',
  LAST_THIRD = 'row--last-third',
}

interface RowProps {
  type?: RowType;
  children?: ReactNode;
  first?: ReactNode;
  last?: ReactNode;
}

export const Row: FC<RowProps> = memo(({ type, children, first, last }) => {
  const classes = ['row', type || RowType.FULL];

  return (
    <div className={classes.join(' ')}>
      {children}
      {first}
      {last}
    </div>
  );
});
