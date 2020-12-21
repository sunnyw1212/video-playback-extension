export const getDataFromSyncStoragePromise = () => {
  const promisifiedSyncStorageRequest = new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (data) => {
      resolve(data);
    });
  });

  return promisifiedSyncStorageRequest;
};
