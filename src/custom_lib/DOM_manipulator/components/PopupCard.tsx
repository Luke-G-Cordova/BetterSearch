import React, { useEffect, useState, useRef } from 'react';
import ReactShadowRoot from 'react-shadow-root';
import Input from './Input';
import { styles } from './Styles.css';
import { togglePopup } from '../DomPopup';
import { Globals } from '../../Globals';

function useDragger(startPos: { x: number; y: number; detectBorder?: number }) {
  if (startPos.detectBorder == null) {
    startPos.detectBorder = Math.max(startPos.x, startPos.y);
  }
  const [pos, setPos] = useState(startPos);
  const stPos = useRef(startPos);
  const endPos = useRef(startPos);
  const tempPos = useRef(startPos);
  const draggableRefElement = useRef<HTMLElement>();
  const prevWindow = useRef({
    x: window.scrollX,
    y: window.scrollY,
  });

  function stopDrag(e: any) {
    e.preventDefault();
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function move(e: any) {
    endPos.current = { x: e.clientX, y: e.clientY };
    tempPos.current = {
      x: tempPos.current.x + (endPos.current.x - stPos.current.x),
      y: tempPos.current.y + (endPos.current.y - stPos.current.y),
    };

    if (
      tempPos.current.x +
        draggableRefElement.current.clientWidth +
        startPos.detectBorder >
      window.innerWidth + window.scrollX
    ) {
      tempPos.current.x =
        window.innerWidth -
        draggableRefElement.current.clientWidth -
        startPos.detectBorder;
    } else if (tempPos.current.x - startPos.detectBorder < 0) {
      tempPos.current.x = 0 + startPos.detectBorder;
    } else {
      stPos.current.x = e.clientX;
    }

    if (
      tempPos.current.y +
        draggableRefElement.current.clientHeight +
        startPos.detectBorder >
      window.innerHeight + window.scrollY
    ) {
      tempPos.current.y =
        window.innerHeight +
        window.scrollY -
        draggableRefElement.current.clientHeight -
        startPos.detectBorder;
    } else if (tempPos.current.y - startPos.detectBorder < 0 + window.scrollY) {
      tempPos.current.y = 0 + startPos.detectBorder + window.scrollY;
    } else {
      stPos.current.y = e.clientY;
    }
    setPos(tempPos.current);
  }

  function scroll() {
    tempPos.current = {
      x: tempPos.current.x + window.scrollX - prevWindow.current.x,
      y: tempPos.current.y + window.scrollY - prevWindow.current.y,
    };
    prevWindow.current = {
      x: window.scrollX,
      y: window.scrollY,
    };
    setPos(tempPos.current);
  }

  function drag(e: any) {
    stPos.current = { x: e.clientX, y: e.clientY };
    document.onmouseup = stopDrag;
    document.onmousemove = move;
  }

  function cleanup() {
    if (document.onmouseup != null) {
      document.removeEventListener('mouseup', stopDrag);
    }
    if (document.onmousemove != null) {
      document.removeEventListener('mousemove', move);
    }
    if (document.onscroll != null) {
      document.removeEventListener('scroll', scroll);
    }
    if (document.onmousedown != null) {
      draggableRefElement.current.removeEventListener('mousedown', drag);
    }
  }
  useEffect(() => {
    draggableRefElement.current.addEventListener('mousedown', drag);
    document.onscroll = scroll;
    return () => {
      cleanup();
    };
  }, []);
  return { pos, draggableRefElement };
}

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
  const { pos, draggableRefElement } = useDragger({
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
          <span id="BS-input-button" className="BSButton BSControlButton">
            NEW
          </span>
          <span
            id="BS-exit-button"
            className="BSButton BSControlButton"
            onClick={() => togglePopup()}
          >
            X
          </span>
        </div>
        <div id="BS-form-wrapper">
          <Input />
        </div>
      </ReactShadowRoot>
    </better-search-popup-card>
  );
}
