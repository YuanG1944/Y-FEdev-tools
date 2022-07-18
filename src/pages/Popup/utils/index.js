export async function setChromeStorage(
  targeStore,
  key,
  value,
  message = 'set success!'
) {
  chrome.storage.sync.set(
    {
      [targeStore]: {
        [key]: value,
      },
    },
    (_) => {
      console.log(message);
    }
  );
}

export async function getChromeStorage(targeStore, key) {
  const store = await chrome.storage.sync.get([targeStore]);
  return store?.[targeStore]?.[key] || null;
}
