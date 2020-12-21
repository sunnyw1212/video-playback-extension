import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  DECREASE_PLAYBACK_RATE,
  INCREASE_PLAYBACK_RATE,
  RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
} from '../../constants';
import { getDataFromSyncStoragePromise } from '../../helpers';

console.log('This is the background pagess.');
console.log('Put the background scripts here.');

const sendit = (request: number) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('tabs', tabs);
    if (tabs.length) {
      chrome.tabs.sendMessage(tabs[0].windowId, request);
    }
  });
};

chrome.runtime.onMessage.addListener((request) => {
  console.log('Message received in background.js!', request);
  // chrome.tabs.sendMessage(request)

  sendit(request);
});

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//   chrome.tabs.sendMessage(tabs[0].id, 'fuck');
// });

chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command:', command);
  const data: any = await getDataFromSyncStoragePromise();
  const isApplyingToAllTabs = data.applyTo === 'all';

  const targetTab = isApplyingToAllTabs
    ? {}
    : { active: true, currentWindow: true };
  switch (command) {
    case DECREASE_PLAYBACK_RATE:
      chrome.tabs.query(targetTab, (tabs) => {
        if (!tabs.length) return true;
        if (!tabs.length) return true;
        // send to all tabs
        if (isApplyingToAllTabs) {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id as number, {
              type: SET_PLAYBACK_RATE,
              payload: { targetRate },
            });
          }
        } else {
          // send to current tab
          if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: SET_PLAYBACK_RATE,
              payload: { targetRate },
            });
          }
        }
      });
      break;
    case INCREASE_PLAYBACK_RATE:
      break;
    case RESET_PLAYBACK_RATE:
      chrome.tabs.query(targetTab, (tabs) => {
        if (!tabs.length) return true;
        // send to current tab
        if (tabs[0].id) {
          console.log('send message to content from background');
          chrome.tabs.sendMessage(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: 1 },
          });
        }
      });
      break;
    default:
      break;
  }
});
