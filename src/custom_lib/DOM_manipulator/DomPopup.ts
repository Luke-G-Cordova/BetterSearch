import { queryShadowSelector } from './components/Components';
import { clearHighlight } from '../highlight/Highlighter';
import { Globals } from '../Globals';
import * as Styler from '../stylers/Styler';

export const togglePopup = () => {
  if (!Globals.popup) {
    openPopup();
  } else {
    closePopup();
  }
};

export const openPopup = () => {
  Globals.popup = document.createElement('better-search-popup-card');
  Object.assign(Globals.popup.style, {
    top: `${20 + window.scrollY}px`,
    left: `${20 + window.scrollX}px`,
  });
  Globals.popup = document.body.insertBefore(
    Globals.popup,
    document.body.firstChild,
  );

  const formWrapper = queryShadowSelector(Globals.popup, '#BS-form-wrapper');
  const exitBtn = queryShadowSelector(Globals.popup, '#BS-exit-button');
  const inputBtn = queryShadowSelector(Globals.popup, '#BS-input-button');

  if (
    formWrapper instanceof HTMLElement &&
    inputBtn instanceof HTMLElement &&
    exitBtn instanceof HTMLElement
  ) {
    // create draggable
    Globals.popupDragger = new Styler.Draggable(Globals.popup, [
      formWrapper,
      inputBtn,
      exitBtn,
    ]);
    Globals.popupDragger.drag();

    // add original input
    formWrapper.appendChild(document.createElement('better-search-input'));

    // add input if clicked
    inputBtn.addEventListener('click', () => {
      if (formWrapper != null && Globals.INPUT_AMT < 6) {
        formWrapper.appendChild(document.createElement('better-search-input'));
      }
    });

    // exit popup if clicked
    exitBtn.addEventListener('mouseup', () => {
      closePopup();
    });
  } else {
    throw 'could not find element';
  }
};
export const closePopup = () => {
  if (Globals.popup != null) {
    Globals.popup.remove();
    Globals.popup = null;
    clearHighlight(Globals.ELEM_KEYS);
  }
};
