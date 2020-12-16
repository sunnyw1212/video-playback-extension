interface SetPlaybackRateMessage {
  type: SET_PLAYBACK_RATE;
  payload: {
    targetRate: number;
  };
}

export type MessageType = SetPlaybackRateMessage;
