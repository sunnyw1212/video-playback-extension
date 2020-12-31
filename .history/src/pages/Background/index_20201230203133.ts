import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  SHORTCUT_DECREASE_PLAYBACK_RATE,
  SHORTCUT_INCREASE_PLAYBACK_RATE,
  SHORTCUT_RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
  SHORTCUT_SKIP_FORWARD,
  SHORTCUT_SKIP_BACKWARD,
  SKIP_FORWARD,
  SKIP_BACKWARD,
  ACTIVATED_TAB,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTab,
  sendMessageToTabs,
} from '../../helpers';

console.log('This is the background pages.');

chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command:', command);
  const {
    applyTo,
    playbackRate,
    skipInterval,
  }: any = await getDataFromSyncStoragePromise();
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
    case SHORTCUT_SKIP_FORWARD:
      const skipForwardMessage = {
        type: SKIP_FORWARD,
        payload: { skipInterval: skipInterval || 30 },
      };
      sendMessageToTabs(tabs, skipForwardMessage, isApplyingToAllTabs);
      break;
    case SHORTCUT_SKIP_BACKWARD:
      const skipBackwardMessage = {
        type: SKIP_BACKWARD,
        payload: { skipInterval: skipInterval || 30 },
      };
      sendMessageToTabs(tabs, skipBackwardMessage, isApplyingToAllTabs);
      break;
    default:
      break;
  }
});
