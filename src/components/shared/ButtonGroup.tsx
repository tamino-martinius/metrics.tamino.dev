import { useState } from 'react';
import './ButtonGroup.css';

interface ButtonGroupProps<T = string> {
  labels: string[] | readonly string[];
  values?: T[];
  onValueChanged?: (value: T) => void;
}

export function ButtonGroup<T>({ labels, values, onValueChanged }: ButtonGroupProps<T>) {
  const [active, setActive] = useState(labels.length - 1);

  function handleClick(index: number) {
    setActive(index);
    if (onValueChanged) {
      onValueChanged((values || (labels as T[]))[index]);
    }
  }

  const buttons = labels.map((label, i) => (
    <button
      type="button"
      key={i}
      onClick={() => handleClick(i)}
      className={`button-group__button${i === active ? ' button-group__button--active' : ''}`}
    >
      {label}
    </button>
  ));

  return <div className="button-group">{buttons}</div>;
}
