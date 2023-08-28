import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, async (tab) => {
  const DEFAULTS: DefaultSettings = await chrome.runtime.sendMessage({
    defaultSettingsRequest: true,
  });

  const container = document.getElementById('popup');
  const root = createRoot(container);
  root.render(<Popup DEFAULTS={DEFAULTS} />);
});
