import type { ReactNode } from 'react';

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

export default function Row({ type, children, first, last }: RowProps) {
  const classes = ['row', type || RowType.FULL];

  return (
    <div className={classes.join(' ')}>
      {children}
      {first}
      {last}
    </div>
  );
}
