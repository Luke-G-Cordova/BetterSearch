import { useState, useRef, useEffect } from 'react';

export default function useDragger(startPos: {
  x: number;
  y: number;
  detectBorder?: number;
}) {
  if (startPos.detectBorder == null) {
    startPos.detectBorder = Math.max(startPos.x, startPos.y);
  }
  const [pos, setPos] = useState(startPos);
  const stPos = useRef(startPos);
  const endPos = useRef(startPos);
  const tempPos = useRef(startPos);
  const draggableRefElement = useRef<HTMLElement>();

  const nonDraggableRefElements = useRef<Array<HTMLElement>>();
  // empty this at every render cycle because it repopulates every time
  nonDraggableRefElements.current = [];
  const draggable = useRef(true);

  const prevWindow = useRef({
    x: window.scrollX,
    y: window.scrollY,
  });

  function stopDrag(e: any) {
    e.preventDefault();
    e.target.style.cursor = 'grab';
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
      tempPos.current.x = startPos.detectBorder;
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
      tempPos.current.y = startPos.detectBorder + window.scrollY;
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
    if (draggable.current) {
      stPos.current = { x: e.clientX, y: e.clientY };
      e.target.style.cursor = 'grabbing';
      document.onmouseup = stopDrag;
      document.onmousemove = move;
    }
  }
  function draggableTrue() {
    draggable.current = true;
  }
  function draggableFalse() {
    draggable.current = false;
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
    nonDraggableRefElements.current.forEach((ndElem) => {
      if (ndElem.onmouseover != null) {
        ndElem.removeEventListener('mouseover', draggableFalse);
        ndElem.removeEventListener('mouseout', draggableTrue);
      }
    });
  }
  function makeChildNonDraggable(ref: HTMLElement) {
    if (ref && !nonDraggableRefElements.current.includes(ref)) {
      ref.style.cursor = 'initial';
      ref.onmouseover = draggableFalse;
      ref.onmouseout = draggableTrue;
      nonDraggableRefElements.current.push(ref);
    }
  }
  useEffect(() => {
    draggableRefElement.current.addEventListener('mousedown', drag);
    document.onscroll = scroll;
    return () => {
      cleanup();
    };
  }, []);

  return {
    pos,
    draggableRefElement,
    makeChildNonDraggable,
  };
}
