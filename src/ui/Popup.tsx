import React from 'react';
import './Popup.scss';
import Logo from './Logo';
import DefaultSettings from './DefaultSettings';

interface PopupProps {
  DEFAULTS: DefaultSettings;
}
export default function Popup({ DEFAULTS }: PopupProps) {
  return (
    <div className="popupContainer">
      <Logo />
      <DefaultSettings DEFAULTS={DEFAULTS} />
    </div>
  );
}
