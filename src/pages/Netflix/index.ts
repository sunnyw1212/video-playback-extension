import {
  RESTART_PLAYER_ACTION,
  SHORTCUT_RESTART_PLAYER,
  SHORTCUT_SKIP_BACKWARD,
  SHORTCUT_SKIP_FORWARD,
  SKIP_BACKWARD,
  SKIP_FORWARD,
  VIDEO_PLAYBACK_EXTENSION,
} from '../../constants';
import { setCurrentTime } from './modules';

window.addEventListener('message', (event) => {
  if (event?.data?.source === VIDEO_PLAYBACK_EXTENSION) {
    switch (event.data.type) {
      case SHORTCUT_SKIP_FORWARD:
      case SKIP_FORWARD:
        setCurrentTime(event.data.skipInterval);
        break;
      case SHORTCUT_SKIP_BACKWARD:
      case SKIP_BACKWARD:
        setCurrentTime(event.data.skipInterval);
        break;
      case SHORTCUT_RESTART_PLAYER:
      case RESTART_PLAYER_ACTION:
        setCurrentTime(event.data.skipInterval);
        break;
      default:
        break;
    }
  }
});
