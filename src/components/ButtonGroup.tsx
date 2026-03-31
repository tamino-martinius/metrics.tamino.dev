import { useState } from 'react';

interface ButtonGroupProps {
  labels: string[];
  values?: any[];
  onValueChanged?: (value: any) => void;
}

export default function ButtonGroup({ labels, values, onValueChanged }: ButtonGroupProps) {
  const [active, setActive] = useState(labels.length - 1);

  function handleClick(index: number) {
    setActive(index);
    if (onValueChanged) {
      onValueChanged((values || labels)[index]);
    }
  }

  const buttons = labels.map((label, i) => (
    <button
      key={i}
      onClick={() => handleClick(i)}
      className={`button-group__button${i === active ? ' button-group__button--active' : ''}`}
    >
      {label}
    </button>
  ));

  return (
    <div className="button-group">
      {buttons}
    </div>
  );
}
