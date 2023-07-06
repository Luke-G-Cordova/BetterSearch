import { useEffect, useState } from 'react';
import * as React from 'react';
import './Popup.scss';
import Logo from './Logo';
import DefaultSettings from './DefaultSettings';

export default function Popup() {
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
