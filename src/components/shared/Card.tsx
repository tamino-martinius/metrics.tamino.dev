import { type FC, memo, type ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title: string;
  className?: string;
  children?: ReactNode;
  titleSlot?: ReactNode;
  footerSlot?: ReactNode;
}

export const Card: FC<CardProps> = memo(({ title, className, children, titleSlot, footerSlot }) => {
  const footer = footerSlot ? <div className="card__footer">{footerSlot}</div> : undefined;

  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      <div className="card__title">
        <h2>{title}</h2>
        {titleSlot}
      </div>
      <div className="card__content">{children}</div>
      {footer}
    </div>
  );
});
