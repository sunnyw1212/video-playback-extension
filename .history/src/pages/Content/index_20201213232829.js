
import {setVideoPlaybackRate} from './modules/setVideoPlaybackRate';

console.log('Video Playback Extension content script loaded');

chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  console.log('got message', request);
  setVideoPlaybackRate(request);
  return true;
})