import * as React from 'react';

export default function Logo() {
  return (
    <div className="logoWrapper">
      <div
        className="logoArea"
        onClick={() => chrome.runtime.sendMessage({ toggle_popup: true })}
      >
        <img src="./icons/logo_color.svg" />
        <span>BetterSearch</span>
      </div>
    </div>
  );
}
