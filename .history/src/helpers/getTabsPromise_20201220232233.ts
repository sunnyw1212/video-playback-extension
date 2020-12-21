enum Tabs {
  CURRENT = 'CURRENT',
  ALL = 'ALL',
}

export const getTabsPromise = (requestedTab: Tabs) => {
  const promisifiedTabsRequest = new Promise((resolve, reject) => {
    const targetTab =
      requestedTab === Tabs.CURRENT
        ? { active: true, currentWindow: true }
        : {};

    chrome.tabs.query(targetTab, (tabs) => {
      resolve(tabs);
    });
  });

  return promisifiedTabsRequest;
};
