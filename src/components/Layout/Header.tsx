import { type FC, memo } from 'react';
import './Header.css';

export const Header: FC = memo(() => {
  return (
    <header className="header">
      <h1>Metrics</h1>
    </header>
  );
});
