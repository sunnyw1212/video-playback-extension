import { Tabs } from '../types';

export const getTabsPromise = (requestedTab: Tabs) => {
  const promisifiedTabsRequest = new Promise((resolve, reject) => {
    const targetTab =
      requestedTab === Tabs.Current
        ? { active: true, currentWindow: true }
        : {};

    chrome.tabs?.query(targetTab, (tabs) => {
      resolve(tabs);
    });
  });

  return promisifiedTabsRequest;
};
