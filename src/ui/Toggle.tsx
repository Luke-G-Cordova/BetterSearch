import * as React from 'react';
import { useState } from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  htmlFor: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Must have a label wrapping this element with an appropriate htmlFor for this element to work
 * @param htmlFor this will become the id of the internal input. This should be the same as the htmlFor of the parent label.
 * @param defaultChecked optional should be checked on start. defaults to false.
 * @param onChange optional callback for on change event.
 * @returns
 */
export default function Toggle({
  defaultChecked = false,
  htmlFor,
  onChange,
}: ToggleProps) {
  return (
    <span className="toggle">
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
    </span>
  );
}
