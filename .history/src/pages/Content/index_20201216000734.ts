import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

const observer = new MutationObserver((mutations) => {
  mutations?.forEach((mutation) => {
    mutation?.addedNodes?.forEach((addedNode) => {
      if (addedNode.nodeName === 'VIDEO') {
        console.log('is a video');
        setVideoPlaybackRate();
      }
      // handle nested videos
      // it might be text node or comment node which don't have querySelectorAll
      const hasNestedVideos =
        (<HTMLElement>addedNode).querySelectorAll &&
        (<HTMLElement>addedNode).querySelectorAll('video').length;

      if (hasNestedVideos) {
        console.log('has nested videos');
        setVideoPlaybackRate();
      }
    });
  });
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
