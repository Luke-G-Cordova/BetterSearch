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
chrome.commands.onCommand.addListener((command) => {
  if (
    command === 'toggle_popup' ||
    command === 'close_popup' ||
    command === 'open_popup'
  ) {
    const sendObj: communicationInfo = {
      from: 'background',
      subject: command,
    };
    sendData(sendObj);
  }
});

// chrome.action.onClicked.addListener(() => {
//   const sendObj: communicationInfo = {
//     from: 'background',
//     subject: 'toggle_popup',
//   };
//   sendData(sendObj);
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.popupMounted) {
    console.log('eventPage notified that popup.tsx has mounted');
  }
});
