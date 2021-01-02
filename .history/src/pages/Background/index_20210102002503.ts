import {
  SHORTCUT_DECREASE_PLAYBACK_RATE,
  SHORTCUT_INCREASE_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
  SHORTCUT_SKIP_FORWARD,
  SHORTCUT_SKIP_BACKWARD,
  SKIP_FORWARD,
  SKIP_BACKWARD,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTabs,
} from '../../helpers';

console.log('This is the background pages.');

const handleCommand = async (command: any) => {
  console.log('Command:', command);
  const {
    isEnabled,
    applyTo,
    playbackRate,
    skipInterval,
  }: any = await getDataFromSyncStoragePromise();
  const tabs: any = await getTabsPromise(applyTo);

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

chrome.commands.onCommand.addListener(handleCommand);
