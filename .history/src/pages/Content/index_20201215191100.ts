import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

// chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" });

const videos = document.querySelectorAll('video');
if (videos && videos.length) {
  console.log('videos', videos);
  videos.forEach((video) => {
    video.addEventListener('play', (e) => {
      chrome.storage.local.get(['playbackRate'], (res) => {
        if (res['playbackRate']) {
          setVideoPlaybackRate(res['playbackRate']);
        }
      });
    });
  });
}

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
