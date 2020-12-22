export const sendMessageToTab = (tabID, messageType, payload) => {
  chrome.tabs.sendMessage(tabID, {
    type: messageType,
    payload,
  });
};
