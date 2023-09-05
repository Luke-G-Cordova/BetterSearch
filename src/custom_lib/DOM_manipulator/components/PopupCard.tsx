import React from 'react';
import ReactShadowRoot from 'react-shadow-root';
import Input from './Input';
import { styles } from './Styles.css';
import { togglePopup } from '../DomPopup';
import useDragger from './dragger';

interface PopupCardPropsPos {
  startX: number;
  startY: number;
  detectBorder?: number;
}
interface PopupCardPropsDetect {
  startX?: number;
  startY?: number;
  detectBorder: number;
}
export default function PopupCard({
  startX,
  startY,
  detectBorder,
}: PopupCardPropsPos | PopupCardPropsDetect) {
  if (startX == null && detectBorder == null) {
    throw new Error('startX or detectBorder must be initialized');
  } else if (startX == null) {
    startX = startY = detectBorder;
  } else if (detectBorder == null) {
    detectBorder = startY = startX;
  }
  const { pos, draggableRefElement, makeChildNonDraggable } = useDragger({
    x: startX + window.scrollX,
    y: startY + window.scrollY,
    detectBorder,
  });
  return (
    <better-search-popup-card
      style={{ left: pos.x + 'px', top: pos.y + 'px' }}
      ref={draggableRefElement}
    >
      <ReactShadowRoot mode="closed">
        <style>{styles}</style>
        <div id="BS-control-wrapper">
          <span
            id="BS-input-button"
            className="BSButton BSControlButton"
            ref={makeChildNonDraggable}
          >
            NEW
          </span>
          <span
            id="BS-exit-button"
            className="BSButton BSControlButton"
            onClick={() => togglePopup()}
            ref={makeChildNonDraggable}
          >
            X
          </span>
        </div>
        <div id="BS-form-wrapper">
          <Input nonDraggableRefElement={makeChildNonDraggable} />
        </div>
      </ReactShadowRoot>
    </better-search-popup-card>
  );
}
