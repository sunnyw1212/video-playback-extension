import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTabs,
} from '.';
import {
  SHORTCUT_DECREASE_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
  SHORTCUT_INCREASE_PLAYBACK_RATE,
  SHORTCUT_SKIP_FORWARD,
  SKIP_FORWARD,
  SHORTCUT_SKIP_BACKWARD,
  SKIP_BACKWARD,
} from '../constants';

export const handleShortcutCommands = async (command: string) => {
  console.log('handleshortcutcommnads', command);
  const {
    isEnabled,
    applyTo,
    playbackRate,
    skipInterval,
  }: any = await getDataFromSyncStoragePromise();
  let tabs: any = [];
  try {
    tabs = await getTabsPromise(applyTo);
  } catch (error) {}
  console.log('fuck', tabs);

  const isApplyingToAllTabs = applyTo === 'all';

  // early exit if disabled
  if (isEnabled === false) {
    return false;
  }

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

      console.log('shortcut increase yo', tabs);

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
};
