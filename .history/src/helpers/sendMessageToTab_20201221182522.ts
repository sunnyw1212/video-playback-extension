export const sendMessageToTab = (
  tabID: number,
  messageType: string,
  payload: any
) => {
  chrome.tabs.sendMessage(tabID, {
    type: messageType,
    payload,
  });
};
