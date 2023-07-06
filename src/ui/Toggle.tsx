import * as React from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  label?: string;
  htmlFor: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({
  defaultChecked = false,
  htmlFor,
  label,
  onChange,
}: ToggleProps) {
  return (
    <div className="toggle">
      <label htmlFor={htmlFor}>
        {label}
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          id={htmlFor}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
        />
        <div className="togglePill">
          <div className="togglePillGrad"></div>
          <span className="toggleSlider" />
        </div>
      </label>
    </div>
  );
}
