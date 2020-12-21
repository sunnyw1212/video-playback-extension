export const getDataFromSyncStoragePromise = () => {
  const getAllDataFromStoragePromise = new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (data) => {
      resolve(data);
    });
  });

  return getAllDataFromStoragePromise;
};
