import { getStorageData, initializeStorageWithDefaults } from './storage';
import * as defaults from '../static/DefaultSettings.json';

let DEFAULTS: DefaultSettings;

chrome.runtime.onInstalled.addListener(async () => {
  await initializeStorageWithDefaults(defaults);
  DEFAULTS = (await getStorageData()) as DefaultSettings;
  console.log('extension installed successfully');
});

// load defaults on startup
chrome.runtime.onStartup.addListener(async () => {
  DEFAULTS = (await getStorageData()) as DefaultSettings;
  console.log('extension started successfully');
});

// Log storage changes, might be safely removed
chrome.storage.onChanged.addListener(async (changes) => {
  DEFAULTS = (await getStorageData()) as DefaultSettings;
  for (const [key, value] of Object.entries(changes)) {
    console.log(
      `"${key}" changed from "${value.oldValue}" to "${value.newValue}"`,
    );
  }
});

/**
 * sends data to different parts of the extension
 * @param data object to be sent
 */
const sendData = (data: communicationInfo) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0].id != null) {
        chrome.tabs.sendMessage(tabs[0].id, data);
      } else {
        console.error('tabId is undefined');
      }
    },
  );
};

/**
 * these send the open_popup event to the content scripts
 */
chrome.commands.onCommand.addListener(async (command) => {
  if (
    command === 'toggle_popup' ||
    command === 'close_popup' ||
    command === 'open_popup'
  ) {
    if (DEFAULTS == null) {
      console.log('defaults restored');
      DEFAULTS = (await getStorageData()) as DefaultSettings;
    }
    const sendObj: communicationInfo = {
      from: 'background',
      subject: command,
    };
    sendData(sendObj);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(request);
  if (request.popupMounted) {
    console.log('eventPage notified that popup.tsx has mounted');
  }
  if (request.defaultSettingsRequest) {
    sendResponse(DEFAULTS);
  }
  if (request.toggle_popup) {
    const sendObj: communicationInfo = {
      from: 'background',
      subject: 'toggle_popup',
    };
    sendData(sendObj);
  }
});
