import * as React from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  htmlFor: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({
  defaultChecked = false,
  htmlFor,
  onChange,
}: ToggleProps) {
  return (
    <div className="toggle">
      <label htmlFor={htmlFor}>
        {htmlFor}
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
          <span className="toggleSlider" />
        </div>
      </label>
    </div>
  );
}
