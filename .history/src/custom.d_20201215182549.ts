declare module '*.svg' {
  const content: any;
  export default content;
}

interface SetPlaybackRateMessage {
  type: SET_PLAYBACK_RATE;
  payload: {
    targetRate: number;
  };
}

export type MessageType = SetPlaybackRateMessage;
