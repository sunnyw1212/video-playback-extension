import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

const didDOMContainVideo = document.body.contains(
  document.querySelector('video')
);
const observer = new MutationObserver((mutations) => {
  if (
    document.body.contains(document.querySelector('video')) &&
    !didDOMContainVideo
  ) {
    setVideoPlaybackRate();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.storage.sync.get(['playbackRate'], (res) => {
  if (res['playbackRate']) {
    setVideoPlaybackRate(res['playbackRate']);
  }
});

chrome.runtime.onMessage.addListener(
  (message: MessageType, sender, sendResponse) => {
    switch (message.type) {
      case SET_PLAYBACK_RATE:
        setVideoPlaybackRate(message.payload.targetRate);
        break;
      default:
        break;
    }

    return true;
  }
);
