import { togglePopup } from './custom_lib/DOM_manipulator/DomPopup';

chrome.runtime.onMessage.addListener((msg: communicationInfo) => {
  if (msg.from === 'background' && msg.subject === 'toggle_popup') {
    togglePopup();
  }
});
