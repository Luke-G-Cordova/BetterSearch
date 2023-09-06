import React, { useState, useRef } from 'react';
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
  const inputKeys = useRef(1);
  const [inputs, setInputs] = useState([
    <Input
      ariaKey={0 + ''}
      key={0}
      nonDraggableRefElement={makeChildNonDraggable}
    />,
  ]);
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
            onClick={() => {
              setInputs((arr) => {
                if (arr.length < 6) {
                  arr.push(
                    <Input
                      ariaKey={inputKeys.current + ''}
                      key={inputKeys.current}
                      nonDraggableRefElement={makeChildNonDraggable}
                    />,
                  );
                  inputKeys.current += 1;
                  return [...arr];
                }
                return arr;
              });
            }}
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
        <div className="BS-break"></div>
        <div
          id="BS-form-wrapper"
          onClick={(e) => {
            if (
              (e.target as HTMLElement).className.includes('BSDeleteButton')
            ) {
              setInputs((arr) => {
                const idx = arr
                  .reduce((prev, cur, i) => {
                    prev.push(cur.key);
                    return prev;
                  }, [])
                  .indexOf(
                    (
                      (e.target as HTMLElement).parentNode
                        .parentNode as HTMLElement
                    ).ariaLabel,
                  );
                arr.splice(idx, 1);
                if (arr.length === 0) {
                  arr.push(
                    <Input
                      ariaKey={inputKeys.current + ''}
                      key={inputKeys.current}
                      nonDraggableRefElement={makeChildNonDraggable}
                    />,
                  );
                  inputKeys.current += 1;
                }
                return [...arr];
              });
            }
          }}
        >
          {...inputs}
          {/* <Input nonDraggableRefElement={makeChildNonDraggable} /> */}
        </div>
      </ReactShadowRoot>
    </better-search-popup-card>
  );
}
