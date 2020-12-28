import { sendMessageToTab } from '.';

export const sendMessageToTabs = (
  tabs: Array<any>,
  message: Object,
  isApplyingToAllTabs: boolean
) => {
  // send message to content script in active tab
  if (!tabs.length) return true;
  // send to all tabs
  if (isApplyingToAllTabs) {
    for (let i = 0; i < tabs.length; i++) {
      sendMessageToTab(tabs[i].id, message);
    }
  } else {
    // send to current tab
    if (tabs[0].id) {
      sendMessageToTab(tabs[0].id, message);
    }
  }
};
