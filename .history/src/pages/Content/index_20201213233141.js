
import {setVideoPlaybackRate} from './modules/setVideoPlaybackRate';

console.log('Video Playback Extension content script loaded');

// chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  setVideoPlaybackRate(request);
  return true;
})