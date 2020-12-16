import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

// chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" });

document.addEventListener('DOMContentLoaded', (event) => {
  const videos = document.querySelectorAll('video');
  if (videos && videos.length) {
    console.log('videos', videos);
    videos.forEach((video) => {
      video.addEventListener('play', (e) => {
        console.log('FUCK YOU PLAY', e);
      });
    });
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
