//background.js

const currTabsCookie = {
  tab: null,
  cookies: [],
};

//接收消息
chrome.runtime.onMessage.addListener(
  async (onMessage, sender, sendResponse) => {
    if (onMessage?.__urlTabs?.isurlTabs) {
      const { __urlTabs } = onMessage;
      handleUrlTabs(__urlTabs, sendResponse);
    }
  }
);

async function handleUrlTabs(urlTabs, sendResponse) {
  const { targetDomain, currUrlValue } = urlTabs;
  let jumpTarget = `${targetDomain}${currUrlValue.pathname}${currUrlValue.search}`;
  if (jumpTarget[jumpTarget.length - 1] === '/') {
    jumpTarget = jumpTarget.slice(0, jumpTarget.length - 1);
  }
  console.log('jumpTarget-->', jumpTarget);
  const cookies = await chrome.cookies.getAll({
    url: currUrlValue.origin,
  });
  try {
    // console.log('当前页面的cookie', currUrlValue.origin);
    console.log('当前页面的cookie', cookies);
    const newTabs = await chrome.tabs.create({
      url: jumpTarget,
      active: true,
    });
    currTabsCookie.tab = newTabs;
    currTabsCookie.cookies = cookies;
    console.log('currTabsCookie', currTabsCookie);
  } catch (e) {
    sendResponse({
      page: 'urlTabs',
      message: 'Get current cookie failed',
    });
  }
  sendResponse('哈哈哈');
}

chrome.tabs.onUpdated.addListener(async (tabid, info) => {
  console.log(tabid, info);
  const { status } = info;
  if (status === 'complete') {
    console.log(tabid, currTabsCookie);
    if (tabid && currTabsCookie?.tab?.id && tabid === currTabsCookie.tab.id) {
      chrome.tabs.sendMessage(tabid, currTabsCookie, function (response) {
        console.log('sendMessage-->', response);
      });
    }
  }
});
