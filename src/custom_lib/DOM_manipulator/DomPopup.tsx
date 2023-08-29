import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { queryShadowSelector } from './components/Components';
import { clearHighlight } from '../highlight/Highlighter';
import { Globals } from '../Globals';
import * as Styler from '../stylers/Styler';
import PopupCard from './components/PopupCard';

let container: HTMLElement;
let root: Root | null;

export const togglePopup = () => {
  if (container == null) {
    container = document.createElement('better-search-popup-wrapper');
    container.style.position = 'relative';
    container.style.width = '0';
    container.style.height = '0';
    container.id = 'BetterSearchRoot';
    document.body.insertBefore(container, document.body.firstChild);
    root = createRoot(document.getElementById('BetterSearchRoot'));
    root.render(<PopupCard />);
    // openPopup();
  } else {
    root.unmount();
    container.remove();
    container = null;
    clearHighlight(Globals.ELEM_KEYS);
    // closePopup();
  }
};

// export const openPopup = () => {
//   Globals.popup = document.createElement('better-search-popup-card');
//   Object.assign(Globals.popup.style, {
//     top: `${20 + window.scrollY}px`,
//     left: `${20 + window.scrollX}px`,
//   });
//   Globals.popup = document.body.insertBefore(
//     Globals.popup,
//     document.body.firstChild,
//   );
//   const formWrapper = queryShadowSelector(Globals.popup, '#BS-form-wrapper');
//   const exitBtn = queryShadowSelector(Globals.popup, '#BS-exit-button');
//   const inputBtn = queryShadowSelector(Globals.popup, '#BS-input-button');
//   if (
//     formWrapper instanceof HTMLElement &&
//     inputBtn instanceof HTMLElement &&
//     exitBtn instanceof HTMLElement
//   ) {
//     // create draggable
//     Globals.popupDragger = new Styler.Draggable(Globals.popup, [
//       formWrapper,
//       inputBtn,
//       exitBtn,
//     ]);
//     Globals.popupDragger.drag();
//     // add original input
//     formWrapper.appendChild(document.createElement('better-search-input'));
//     // add input if clicked
//     inputBtn.addEventListener('click', () => {
//       if (formWrapper != null && Globals.INPUT_AMT < 6) {
//         formWrapper.appendChild(document.createElement('better-search-input'));
//       }
//     });
//     // exit popup if clicked
//     exitBtn.addEventListener('mouseup', () => {
//       closePopup();
//     });
//   } else {
//     throw 'could not find element';
//   }
// };
// export const closePopup = () => {
//   if (Globals.popup != null) {
//     Globals.popup.remove();
//     Globals.popup = null;
//     clearHighlight(Globals.ELEM_KEYS);
//   }
// };
