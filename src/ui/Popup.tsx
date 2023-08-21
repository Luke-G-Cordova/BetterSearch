import { useEffect, useState } from 'react';
import * as React from 'react';
import './Popup.scss';
import Logo from './Logo';
import DefaultSettings from './DefaultSettings';
import SettingImporter from './SettingImporter';

interface PopupProps {
  DEFAULTS: DefaultSettings;
}
export default function Popup({ DEFAULTS }: PopupProps) {
  return (
    <div className="popupContainer">
      <Logo />
      {/* <SettingImporter /> */}
      <DefaultSettings DEFAULTS={DEFAULTS} />
      {/* <ul>
        {coms.map((com, i) => (
          <li key={i}>{com.name}</li>
        ))}
      </ul> */}
    </div>
  );
}
