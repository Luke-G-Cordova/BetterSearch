import React from 'react';
import ReactShadowRoot from 'react-shadow-root';
import Input from './Input';
import { styles } from './Styles.css';

export default function PopupCard() {
  return (
    <ReactShadowRoot>
      <style>{styles}</style>
      <div id="BS-control-wrapper">
        <span id="BS-input-button" className="BSButton BSControlButton">
          NEW
        </span>
        <span id="BS-exit-button" className="BSButton BSControlButton">
          X
        </span>
      </div>
      <div id="BS-form-wrapper">
        <Input />
      </div>
    </ReactShadowRoot>
  );
}
