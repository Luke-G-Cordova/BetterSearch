import React, { useState } from 'react';

export default function CustomInput(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  const [val, setVal] = useState(props.defaultValue);
  let inputProps;
  switch (props.type) {
    case 'toggle':
      inputProps = Object.assign({}, props, { type: 'checkbox' });
      return (
        <span className="toggle">
          <input {...inputProps} />
          <div className="togglePill">
            <div className="togglePillGrad"></div>
            <span className="toggleSlider" />
          </div>
        </span>
      );
    case 'hex':
      inputProps = Object.assign({}, props, { type: 'color' });
      return <input className="colorInput" {...inputProps} />;
    case 'range':
      inputProps = Object.assign({}, props, {
        min: 0,
        max: 1,
        step: 0.01,
      });
      return (
        <>
          <input
            className="rangeInput"
            onInput={(e) => {
              setVal(Number((e.target as HTMLInputElement).value));
            }}
            {...inputProps}
          />
          <span>{val}</span>
        </>
      );
    default:
      return <input {...props} />;
  }
}
