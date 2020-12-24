import { SET_PLAYBACK_RATE } from './constants';

interface SetPlaybackRateMessage {
  type: string;
  payload: any;
}

export type MessageType = SetPlaybackRateMessage;

export enum Tabs {
  Current = 'current',
  All = 'all',
}
