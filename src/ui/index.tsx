import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  const container = document.getElementById('popup');
  const root = createRoot(container);
  root.render(<Popup />);
});
