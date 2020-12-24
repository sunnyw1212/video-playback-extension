import { SET_PLAYBACK_RATE } from './constants';

interface SetPlaybackRateMessage {
  type: typeof SET_PLAYBACK_RATE;
  payload: {
    targetRate: number;
  };
}

export type MessageType = SetPlaybackRateMessage;

enum Tabs {
  Current = 'current',
  All = 'all',
}
