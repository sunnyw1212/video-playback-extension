export const sendMessageToTab = (tabID: number, message: Object) => {
  chrome.tabs.sendMessage(tabID, message);
};
