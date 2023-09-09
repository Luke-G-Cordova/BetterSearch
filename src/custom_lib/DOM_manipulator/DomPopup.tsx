import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { clearHighlight } from '../highlight/Highlighter';
import { Globals } from '../Globals';
import PopupCard from './components/PopupCard';

let container: HTMLElement;
let root: Root | null;

export const togglePopup = async () => {
  if (container == null) {
    container = document.createElement('better-search-popup-wrapper');
    container.style.position = 'relative';
    container.style.width = '0';
    container.style.height = '0';
    container.id = 'BetterSearchRoot';
    document.body.insertBefore(container, document.body.firstChild);
    root = createRoot(document.getElementById('BetterSearchRoot'));
    root.render(
      <PopupCard
        defaults={await chrome.runtime.sendMessage({
          defaultSettingsRequest: true,
        })}
        detectBorder={20}
      />,
    );
  } else {
    root.unmount();
    container.remove();
    container = null;
    clearHighlight(Globals.ELEM_KEYS);
  }
};
