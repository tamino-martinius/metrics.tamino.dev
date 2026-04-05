import './Dropdown.css';

interface DropdownProps<T = string> {
  labels: string[];
  values?: T[];
  onValueChanged?: (value: T) => void;
  value?: T;
}

export function Dropdown<T>({ labels, values, onValueChanged, value }: DropdownProps<T>) {
  const resolvedValues = values || (labels as unknown as T[]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (onValueChanged) {
      onValueChanged(resolvedValues[e.target.selectedIndex]);
    }
  }

  const selectedIndex = value !== undefined ? resolvedValues.indexOf(value) : 0;

  return (
    <select className="dropdown" value={String(selectedIndex)} onChange={handleChange}>
      {labels.map((label, i) => (
        <option key={i} value={String(i)}>
          {label}
        </option>
      ))}
    </select>
  );
}
