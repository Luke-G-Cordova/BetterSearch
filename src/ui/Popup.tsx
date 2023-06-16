import { useEffect } from 'react';
import * as React from 'react';
import './Popup.scss';

export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  return <div className="popupContainer">Hello, world!</div>;
}
