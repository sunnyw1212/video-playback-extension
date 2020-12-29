import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  SHORTCUT_DECREASE_PLAYBACK_RATE,
  SHORTCUT_INCREASE_PLAYBACK_RATE,
  SHORTCUT_RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
  SHORTCUT_SKIP_FORWARD,
  SHORTCUT_SKIP_BACKWARD,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTabs,
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

      const decreasedPlaybackRateMessage = {
        type: SET_PLAYBACK_RATE,
        payload: { targetRate: decreasedPlaybackRate },
      };

      sendMessageToTabs(
        tabs,
        decreasedPlaybackRateMessage,
        isApplyingToAllTabs
      );
      break;
    case SHORTCUT_INCREASE_PLAYBACK_RATE:
      const increasedPlaybackRate = parseFloat(playbackRate) + 0.25;
      chrome.storage.sync.set({ playbackRate: increasedPlaybackRate });

      const increasedPlaybackRateMessage = {
        type: SET_PLAYBACK_RATE,
        payload: { targetRate: increasedPlaybackRate },
      };

      sendMessageToTabs(
        tabs,
        increasedPlaybackRateMessage,
        isApplyingToAllTabs
      );

      break;
    case SHORTCUT_RESET_PLAYBACK_RATE:
      const resettedPlaybackRate = 1;
      chrome.storage.sync.set({ playbackRate: resettedPlaybackRate });

      const resettedPlaybackRateMessage = {
        type: SET_PLAYBACK_RATE,
        payload: { targetRate: resettedPlaybackRate },
      };

      sendMessageToTabs(tabs, resettedPlaybackRateMessage, isApplyingToAllTabs);
      break;
    case SHORTCUT_SKIP_FORWARD:
      break;
    case SHORTCUT_SKIP_BACKWARD:
      break;
    default:
      break;
  }
});
