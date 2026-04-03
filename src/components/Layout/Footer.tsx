import { type FC, memo } from 'react';
import './Footer.css';

export const Footer: FC = memo(() => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <a href="https://tamino.dev">Made with ❤ by Tamino Martinius</a>
        </div>
        <div className="footer__center">
          <a href="https://github.com/tamino-martinius/metrics.tamino.dev">Open Source - Code available at GitHub</a>
        </div>
        <div className="footer__right">
          <a href="https://tamino.dev/#legal">Legal</a>
        </div>
      </div>
    </footer>
  );
});
