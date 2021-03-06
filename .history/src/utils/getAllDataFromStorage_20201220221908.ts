export const getAllDataFromStorage = async () => {
  const getAllDataFromStoragePromise = new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (data) => {
      resolve(data);
    });
  }) as Promise<any>;

  return (await getAllDataFromStoragePromise()) as any;
};
