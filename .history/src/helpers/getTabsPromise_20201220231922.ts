export const getTabsPromise = (shouldGetCurrentTabOnly: string) => {
  const promisifiedTabsRequest = new Promise((resolve, reject) => {
    const targetTab = shouldGetCurrentTabOnly
      ? { active: true, currentWindow: true }
      : {};
    chrome.tabs.query(targetTab, (tabs) => {
      resolve(tabs);
    });
  });

  return promisifiedTabsRequest;
};
