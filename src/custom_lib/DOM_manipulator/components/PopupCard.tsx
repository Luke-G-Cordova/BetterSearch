import React, { useEffect, useState, useRef } from 'react';
import ReactShadowRoot from 'react-shadow-root';
import Input from './Input';
import { styles } from './Styles.css';
import { togglePopup } from '../DomPopup';
import { Globals } from '../../Globals';

function useDragger(startPos: { x: number; y: number }) {
  const [pos, setPos] = useState(startPos);
  const stPos = useRef(startPos);
  const endPos = useRef(startPos);
  const tempPos = useRef(startPos);
  const draggableRefElement = useRef<HTMLElement>();
  const prevWindow = useRef({
    x: window.scrollX,
    y: window.scrollY,
  });
  const leftBorderSize = 50;

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
        leftBorderSize >
      window.innerWidth + window.scrollX
    ) {
      tempPos.current.x =
        window.innerWidth -
        draggableRefElement.current.clientWidth -
        leftBorderSize;
    } else if (tempPos.current.x - leftBorderSize < 0) {
      tempPos.current.x = 0 + leftBorderSize;
    } else {
      stPos.current.x = e.clientX;
    }

    if (
      tempPos.current.y +
        draggableRefElement.current.clientHeight +
        leftBorderSize >
      window.innerHeight + window.scrollY
    ) {
      tempPos.current.y =
        window.innerHeight +
        window.scrollY -
        draggableRefElement.current.clientHeight -
        leftBorderSize;
    } else if (tempPos.current.y - leftBorderSize < 0 + window.scrollY) {
      tempPos.current.y = 0 + leftBorderSize + window.scrollY;
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

export default function PopupCard() {
  const { pos, draggableRefElement } = useDragger({ x: 20, y: 20 });
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
