import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { clearHighlight } from '../highlight/Highlighter';
import { Globals } from '../Globals';
import PopupCard from './components/PopupCard';
import { renderPDF, updateTextModel } from '../highlight/PDFHighlighter';

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
    document.body.append(Globals.pdfTextModel);

    const canvas = document.createElement('canvas');
    canvas.style.margin = 'auto';
    canvas.className = 'renderArea';
    const textLayer = document.createElement('div');
    textLayer.className = 'textLayer';
    document.body.append(canvas, textLayer);
    renderPDF(canvas, textLayer);
  } else {
    root.unmount();
    container.remove();
    container = null;
    clearHighlight(Globals.ELEM_KEYS);
  }
};
