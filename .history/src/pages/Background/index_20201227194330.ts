import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  SHORTCUT_DECREASE_PLAYBACK_RATE,
  SHORTCUT_INCREASE_PLAYBACK_RATE,
  SHORTCUT_RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTab,
} from '../../helpers';

console.log('This is the background pages.');

chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command:', command);
  const { applyTo, playbackRate }: any = await getDataFromSyncStoragePromise();
  const tabs: any = await getTabsPromise(applyTo);

  const isApplyingToAllTabs = applyTo === 'all';

  switch (command) {
    case SHORTCUT_DECREASE_PLAYBACK_RATE:
      const decreasedPlaybackRate = parseFloat(playbackRate) - 0.25;
      chrome.storage.sync.set({ playbackRate: decreasedPlaybackRate });

      if (!tabs.length) return true;
      // send to all tabs
      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          sendMessageToTab(tabs[i].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: decreasedPlaybackRate },
          });
        }
      } else {
        // send to current tab
        if (tabs[0].id) {
          sendMessageToTab(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: decreasedPlaybackRate },
          });
        }
      }
      break;
    case SHORTCUT_INCREASE_PLAYBACK_RATE:
      const increasedPlaybackRate = parseFloat(playbackRate) + 0.25;
      chrome.storage.sync.set({ playbackRate: increasedPlaybackRate });

      if (!tabs.length) return true;
      // send to all tabs
      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          sendMessageToTab(tabs[i].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: increasedPlaybackRate },
          });
        }
      } else {
        // send to current tab
        if (tabs[0].id) {
          sendMessageToTab(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: increasedPlaybackRate },
          });
        }
      }
      break;
    case SHORTCUT_RESET_PLAYBACK_RATE:
      const resettedPlaybackRate = 1;
      chrome.storage.sync.set({ playbackRate: resettedPlaybackRate });

      if (!tabs.length) return true;
      // send to all tabs
      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          sendMessageToTab(tabs[i].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: resettedPlaybackRate },
          });
        }
      } else {
        // send to current tab
        if (tabs[0].id) {
          sendMessageToTab(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: resettedPlaybackRate },
          });
        }
      }
      break;
    default:
      break;
  }
});
