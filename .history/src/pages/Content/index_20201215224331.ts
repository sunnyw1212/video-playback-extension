import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

// let inDOM = document.body.contains(document.querySelector('video'));
const observer = new MutationObserver((mutations) => {
  console.log('mutations', mutations);
  // if (document.body.contains(document.querySelector('video'))) {
  //   if (!inDOM) {
  //     // video element has been inserted
  //     setVideoPlaybackRate();
  //   }
  //   inDOM = true;
  // }
  mutations?.forEach((mutation) => {
    mutation?.addedNodes?.forEach((addedNode) => {
      if (addedNode.nodeName === 'VIDEO') {
        setVideoPlaybackRate();
      }
      // it might be text node or comment node which don't have querySelectorAll
      addedNode.querySelectorAll &&
        addedNode.querySelectorAll('video').forEach(addVideoHandler);
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
