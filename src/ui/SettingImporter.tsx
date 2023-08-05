import * as React from 'react';
import { useState, useEffect } from 'react';

export default function SettingImporter() {
  const [coms, setComs] = useState<chrome.commands.Command[]>([]);
  useEffect(() => {
    chrome.commands.getAll((commands) => {
      setComs(commands);
    });
  });

  return (
    <div>
      {coms[1]?.shortcut === '' ? (
        <a
          href="#"
          onClick={() =>
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
          }
        >
          Change Keyboard Shortcuts
        </a>
      ) : (
        <p>
          Press <span>{coms[1]?.shortcut}</span> with a website open to open the
          extension!
        </p>
      )}
    </div>
  );
}
