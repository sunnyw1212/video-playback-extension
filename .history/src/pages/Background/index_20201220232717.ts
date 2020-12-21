import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  DECREASE_PLAYBACK_RATE,
  INCREASE_PLAYBACK_RATE,
  RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
} from '../../constants';
import { getDataFromSyncStoragePromise, getTabsPromise } from '../../helpers';

console.log('This is the background pages.');

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
  const { applyTo, playbackRate }: any = await getDataFromSyncStoragePromise();
  const tabs: any = await getTabsPromise(applyTo);

  const isApplyingToAllTabs = applyTo === 'all';

  switch (command) {
    case DECREASE_PLAYBACK_RATE:
      const decreasedPlaybackRate = parseFloat(playbackRate) - 0.25;
      chrome.storage.sync.set({ playbackRate: decreasedPlaybackRate });

      if (!tabs.length) return true;
      // send to all tabs
      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id as number, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: decreasedPlaybackRate },
          });
        }
      } else {
        // send to current tab
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: decreasedPlaybackRate },
          });
        }
      }
      break;
    case INCREASE_PLAYBACK_RATE:
      const increasedPlaybackRate = parseFloat(playbackRate) + 0.25;
      chrome.storage.sync.set({ playbackRate: increasedPlaybackRate });

      if (!tabs.length) return true;
      // send to all tabs
      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id as number, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: increasedPlaybackRate },
          });
        }
      } else {
        // send to current tab
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: increasedPlaybackRate },
          });
        }
      }
      break;
    case RESET_PLAYBACK_RATE:
      const resettedPlaybackRate = 1;
      chrome.storage.sync.set({ playbackRate: resettedPlaybackRate });

      if (!tabs.length) return true;
      // send to current tab
      if (tabs[0].id) {
        console.log('send message to content from background');
        chrome.tabs.sendMessage(tabs[0].id, {
          type: SET_PLAYBACK_RATE,
          payload: { targetRate: resettedPlaybackRate },
        });
      }

      break;
    default:
      break;
  }
});
