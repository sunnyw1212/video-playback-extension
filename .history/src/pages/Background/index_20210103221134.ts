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
  handleShortcutCommands,
  sendMessageToTabs,
} from '../../helpers';

// need to import these so that theyre included in build bundle
import '../../assets/img/icon34.png';
import '../../assets/img/icon34-inactive.png';
import '../../assets/img/icon128.png';

chrome.commands.onCommand.addListener(handleShortcutCommands);
