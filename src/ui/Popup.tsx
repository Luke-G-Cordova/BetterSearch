import { useEffect, useState } from 'react';
import * as React from 'react';
import './Popup.scss';
import Logo from './Logo';
import DefaultSettings from './DefaultSettings';

export default function Popup() {
  const [coms, setComs] = useState<chrome.commands.Command[]>([]);
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
    chrome.commands.getAll((commands) => {
      console.log(commands);
      setComs(commands);
    });
  }, []);

  return (
    <div className="popupContainer">
      <Logo />
      <DefaultSettings />
      {/* <ul>
        {coms.map((com, i) => (
          <li key={i}>{com.name}</li>
        ))}
      </ul> */}
    </div>
  );
}
