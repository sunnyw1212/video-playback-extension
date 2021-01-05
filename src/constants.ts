// messages
export const ENABLE_EXTENSION = 'ENABLE_EXTENSION';
export const DISABLE_EXTENSION = 'DISABLE_EXTENSION';
export const SET_PLAYBACK_RATE = 'SET_PLAYBACK_RATE';
export const SET_MEDIA_ATTRIBUTES = 'SET_MEDIA_ATTRIBUTES';
export const SKIP_FORWARD = 'SKIP_FORWARD';
export const SKIP_BACKWARD = 'SKIP_BACKWARD';
export const PLAY_PLAYER_ACTION = 'PLAY_PLAYER_ACTION';
export const PAUSE_PLAYER_ACTION = 'PAUSE_PLAYER_ACTION';
export const RESTART_PLAYER_ACTION = 'RESTART_PLAYER_ACTION';

// shortcut commands
export const SHORTCUT_DECREASE_PLAYBACK_RATE = 'decrease-playback-rate';
export const SHORTCUT_INCREASE_PLAYBACK_RATE = 'increase-playback-rate';
export const SHORTCUT_RESET_PLAYBACK_RATE = 'reset-playback-rate';
export const SHORTCUT_SKIP_FORWARD = 'skip-forward';
export const SHORTCUT_SKIP_BACKWARD = 'skip-backward';
export const SHORTCUT_PLAY_PLAYER = 'play-player';
export const SHORTCUT_PAUSE_PLAYER = 'pause-player';
export const SHORTCUT_RESTART_PLAYER = 'restart-player';
export const SHORTCUT_LOOP = 'loop';
export const SHORTCUT_THEATER_MODE = 'theater-mode';

export const DEFAULT_SHORTCUT_KEYS = {
  [SHORTCUT_DECREASE_PLAYBACK_RATE]: 's',
  [SHORTCUT_INCREASE_PLAYBACK_RATE]: 'w',
  [SHORTCUT_RESET_PLAYBACK_RATE]: 'e',
  [SHORTCUT_SKIP_FORWARD]: 'd',
  [SHORTCUT_SKIP_BACKWARD]: 'a',
  [SHORTCUT_RESTART_PLAYER]: 'r',
  [SHORTCUT_PLAY_PLAYER]: 'p',
  [SHORTCUT_PAUSE_PLAYER]: 'o',
  [SHORTCUT_LOOP]: 'l',
  [SHORTCUT_THEATER_MODE]: 't',
};

export const SHORTCUT_NAMES = {
  [SHORTCUT_DECREASE_PLAYBACK_RATE]: 'Decrease Playback Speed',
  [SHORTCUT_INCREASE_PLAYBACK_RATE]: 'Increase Playback Speed',
  [SHORTCUT_RESET_PLAYBACK_RATE]: 'Reset Playback Speed',
  [SHORTCUT_SKIP_FORWARD]: 'Skip Forward',
  [SHORTCUT_SKIP_BACKWARD]: 'Skip Backward',
  [SHORTCUT_RESTART_PLAYER]: 'Restart',
  [SHORTCUT_PLAY_PLAYER]: 'Play',
  [SHORTCUT_PAUSE_PLAYER]: 'Pause',
  [SHORTCUT_LOOP]: 'Loop',
  [SHORTCUT_THEATER_MODE]: 'Theater Mode',
};
